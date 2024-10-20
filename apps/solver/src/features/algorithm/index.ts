import { ALGO_VERSION } from "@/constants/env";
import { LATEST_VERSION, type SolveFunc, getSolveFunc, isSolveFuncVersion } from "@data-maki/algorithm";
import type { Answer, Problem, UIMessageEventBase } from "@data-maki/schemas";
import type { SolveStartEvent } from "@data-maki/schemas";
import type { SolveProgressEvent } from "@data-maki/schemas";
import type { SolveFinishedEvent } from "@data-maki/schemas";
import deepEqual from "fast-deep-equal";
import type { LogLayer } from "loglayer";
import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import { span } from "../../logging";
import { DoneState } from "../../state/done.ts";
import { IdleState } from "../../state/idle.ts";
import { StateManager } from "../../state/manager.ts";
import { SolvingState } from "../../state/solving.ts";
import { FeatureBase } from "../base";
import type { ServerCommunicatorFeature } from "../server-comm";
import { InvalidAlgorithmVersionError } from "./errors/invalid-algo";

export class AlgorithmFeature extends FeatureBase {
  #tx: ChannelTx<UIMessageEventBase>;
  #subscriberCount$: ReadonlyStore<number>;
  readonly #solve: SolveFunc;
  readonly #solveBeam: SolveFunc = getSolveFunc("vbeam");

  constructor(
    log: LogLayer,
    tx: ChannelTx<UIMessageEventBase>,
    subscriberCount$: ReadonlyStore<number>,
    private serverComm: ServerCommunicatorFeature,
  ) {
    super("Algorithm", log);

    this.#tx = tx;
    this.#subscriberCount$ = subscriberCount$;

    // biome-ignore lint/style/noNonNullAssertion: This is false positive
    const version = ALGO_VERSION === "latest" ? LATEST_VERSION! : ALGO_VERSION;

    if (!isSolveFuncVersion(version)) {
      throw new InvalidAlgorithmVersionError(version);
    }

    if (ALGO_VERSION !== "latest" && version !== LATEST_VERSION) {
      this.log.warn(`Using outdated algorithm version: ${ALGO_VERSION}`);
    } else {
      this.log.info(`Using algorithm version: ${version}`);
    }

    this.#solve = getSolveFunc(version);
  }

  private sendEvent(event: UIMessageEventBase) {
    if (this.#subscriberCount$.content() > 0) {
      this.#tx.send(event);
    }
  }

  private async submitAnswer(id: string, problem: Problem, answer: Answer, finalBoard?: string[]) {
    let correct = true;

    if (finalBoard) {
      correct = deepEqual(finalBoard, problem.board.goal);

      if (correct) {
        this.log
          .withMetadata({
            id,
            turns: answer.ops.length,
          })
          .info("Answer is correct");
      } else {
        this.log
          .withMetadata({
            id,
            turns: answer.ops.length,
            expected: problem.board.goal,
            actual: finalBoard,
          })
          .error("Answer is incorrect");
      }
    }

    const revision = await this.serverComm.submitAnswer(id, answer);

    return [correct, revision] as const;
  }

  init() {}

  async start() {
    StateManager.instance.state$.subscribe(async (state) => {
      if (state.stateName !== SolvingState.stateName) return;

      const solvingState = state as SolvingState;

      this.log
        .withMetadata({
          id: solvingState.id,
        })
        .info("Solver started");

      const scope = span(this.log, "Solve finished");

      const solvePromise = this.#solve(
        solvingState.problem,
        (workers) => {
          this.sendEvent({
            eventName: "solve.start",
            solveId: solvingState.id,
            workers: workers * 2,
            startedAt: solvingState.startedAt,
            board: solvingState.problem.board,
            general: solvingState.problem.general,
          } satisfies SolveStartEvent);

          solvingState.workers = workers * 2;
        },
        async (workerId, answer) => {
          this.sendEvent({
            eventName: "solve.progress",
            solveId: solvingState.id,
            workerId,
            turns: answer.n,
          } satisfies SolveProgressEvent);

          if (solvingState.currentShortestAnswer === null || answer.n < solvingState.currentShortestAnswer.n) {
            solvingState.currentShortestAnswer = answer;

            const [, revision] = await this.submitAnswer(solvingState.id, solvingState.problem, answer);

            this.log
              .withMetadata({
                id: solvingState.id,
                turns: answer.ops.length,
                revision,
              })
              .info("Answer updated");
          }
        },
      );

      const solveBeamPromise = this.#solveBeam(
        solvingState.problem,
        (workers) => {},
        async (workerId, answer) => {
          this.sendEvent({
            eventName: "solve.progress",
            solveId: solvingState.id,
            workerId: workerId + 8,
            turns: answer.n,
          } satisfies SolveProgressEvent);

          if (solvingState.currentShortestAnswer === null || answer.n < solvingState.currentShortestAnswer.n) {
            solvingState.currentShortestAnswer = answer;

            const [, revision] = await this.submitAnswer(solvingState.id, solvingState.problem, answer);

            this.log
              .withMetadata({
                id: solvingState.id,
                turns: answer.ops.length,
                revision,
              })
              .info("Answer updated");
          }
        },
      );

      scope.end();

      const [answer, finalBoard] = (await Promise.all([solvePromise, solveBeamPromise])).toSorted(
        (a: [Answer, string[]], b: [Answer, string[]]) => a[0].n - b[0].n,
      )[0];

      const [correct, revision] = await this.submitAnswer(solvingState.id, solvingState.problem, answer, finalBoard);

      this.sendEvent({
        eventName: "solve.finished",
        solveId: solvingState.id,
        correct,
        turns: answer.ops.length,
        revision,
      } satisfies SolveFinishedEvent);

      StateManager.instance.setState(new DoneState(solvingState.id, answer));

      setTimeout(() => {
        StateManager.instance.setState(IdleState.instance);

        IdleState.instance.oldProblem = solvingState.problem;
      }, 1000);
    });
  }
}
