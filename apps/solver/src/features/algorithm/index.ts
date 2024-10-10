import { ALGO_VERSION } from "@/constants/env";
import { LATEST_VERSION, type SolveFunc, getSolveFunc, isSolveFuncVersion } from "@data-maki/algorithm";
import deepEqual from "fast-deep-equal";
import type { LogLayer } from "loglayer";
import type { ChannelTx, ReadonlyStore } from "reactive-channel";
import type { UIMessageEvent } from "../../events/base.ts";
import { span } from "../../logging";
import { DoneState } from "../../state/done.ts";
import { StateManager } from "../../state/manager.ts";
import { SolvingState } from "../../state/solving.ts";
import { FeatureBase } from "../base";
import type { ServerCommunicatorFeature } from "../server-comm";
import { InvalidAlgorithmVersionError } from "./errors/invalid-algo";

export class AlgorithmFeature extends FeatureBase {
  #tx: ChannelTx<UIMessageEvent>;
  #subscriberCount$: ReadonlyStore<number>;
  #solve: SolveFunc;

  constructor(
    log: LogLayer,
    tx: ChannelTx<UIMessageEvent>,
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

  private sendEvent(event: UIMessageEvent) {
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

      const [answer, finalBoard] = await this.#solve(solvingState.question);

      if (deepEqual(finalBoard, solvingState.question.board.goal)) {
        this.log
          .withMetadata({
            id: solvingState.id,
          })
          .info("Answer is correct");
      } else {
        this.log
          .withMetadata({
            id: solvingState.id,
            expected: solvingState.question.board.goal,
            actual: finalBoard,
          })
          .error("Answer is incorrect");
      }

      scope.end();

      StateManager.instance.setState(new DoneState(solvingState.id, answer));
    });
  }
}
