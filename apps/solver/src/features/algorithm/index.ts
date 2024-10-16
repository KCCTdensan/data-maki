import { ALGO_VERSION } from "@/constants/env";
import { LATEST_VERSION, type SolveFunc, getSolveFunc, isSolveFuncVersion } from "@data-maki/algorithm";
import type { UIMessageEventBase } from "@data-maki/schemas";
import type { SolveStartEvent } from "@data-maki/schemas";
import type { SolveProgressEvent } from "@data-maki/schemas";
import type { SolveFinishedEvent } from "@data-maki/schemas";
import deepEqual from "fast-deep-equal";
import type { LogLayer } from "loglayer";
import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import { span } from "../../logging";
import { DoneState } from "../../state/done.ts";
import { StateManager } from "../../state/manager.ts";
import { SolvingState } from "../../state/solving.ts";
import { FeatureBase } from "../base";
import type { ServerCommunicatorFeature } from "../server-comm";
import { InvalidAlgorithmVersionError } from "./errors/invalid-algo";

export class AlgorithmFeature extends FeatureBase {
  #tx: ChannelTx<UIMessageEventBase>;
  #subscriberCount$: ReadonlyStore<number>;
  readonly #solve: SolveFunc;

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

      const [answer, finalBoard] = await this.#solve(
        solvingState.problem,
        (workers) => {
          this.sendEvent({
            eventName: "solve.start",
            solveId: solvingState.id,
            workers,
            startedAt: solvingState.startedAt,
            board: solvingState.problem.board,
            general: solvingState.problem.general,
          } satisfies SolveStartEvent);

          solvingState.workers = workers;
        },
        (workerId, turns) => {
          this.sendEvent({
            eventName: "solve.progress",
            solveId: solvingState.id,
            workerId,
            turns,
          } satisfies SolveProgressEvent);
        },
      );

      const correct = deepEqual(finalBoard, solvingState.problem.board.goal);

      if (correct) {
        this.log
          .withMetadata({
            id: solvingState.id,
            turns: answer.ops.length,
          })
          .info("Answer is correct");
      } else {
        this.log
          .withMetadata({
            id: solvingState.id,
            turns: answer.ops.length,
            expected: solvingState.problem.board.goal,
            actual: finalBoard,
          })
          .error("Answer is incorrect");
      }

      scope.end();

      const revision = await this.serverComm.submitAnswer(solvingState.id, solvingState.problem, answer);

      this.sendEvent({
        eventName: "solve.finished",
        solveId: solvingState.id,
        correct,
        turns: answer.ops.length,
        revision,
      } satisfies SolveFinishedEvent);

      StateManager.instance.setState(new DoneState(solvingState.id, answer));
    });
  }
}
