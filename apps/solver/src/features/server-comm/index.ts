import type { Answer, AnswerResponse, Problem } from "@data-maki/schemas";
import cuid2 from "@paralleldrive/cuid2";
import axios, { type AxiosInstance, isAxiosError } from "axios";
import type { LogLayer } from "loglayer";
import typia from "typia";
import { span } from "../../logging";
import { axiosLoggingInterceptor } from "../../logging/third-party/axios.ts";
import { DoneState } from "../../state/done.ts";
import { IdleState } from "../../state/idle.ts";
import { StateManager } from "../../state/manager.ts";
import { SolvingState } from "../../state/solving.ts";
import { FeatureBase } from "../base";
import { ServerUnavailableError } from "./errors/server-unavailable.ts";

export const SERVER_COMMUNICATOR_POLL_INTERVAL = 1000;

export const createProblemId = cuid2.init({
  length: 8,
});

export class ServerCommunicatorFeature extends FeatureBase {
  readonly #baseURL: string;
  readonly #token: string;
  #client!: AxiosInstance;

  constructor(log: LogLayer, baseURL: string, token: string) {
    super("Server Communicator", log);

    this.#baseURL = baseURL;
    this.#token = token;
  }

  async pollProblem() {
    let tries = 1;

    while (true) {
      this.log
        .withMetadata({
          tries,
        })
        .info("Polling problem...");

      const problem = await this.#client
        .get<unknown>("/problem")
        .then(({ data }) => (data ? typia.assert<Problem>(data) : undefined))
        .catch((e) => {
          if (isAxiosError(e)) {
            if (e.response?.status === 403) return undefined;

            throw new ServerUnavailableError(e);
          }

          throw e;
        });

      const id = createProblemId();

      if (problem) {
        this.log
          .withMetadata({
            id,
            tries,
            data: {
              width: problem.board.width,
              height: problem.board.height,
              generalCount: problem.general.n,
            },
          })
          .info("Received problem");

        return [id, problem] as const;
      }

      tries++;

      await new Promise((resolve) => setTimeout(resolve, SERVER_COMMUNICATOR_POLL_INTERVAL));
    }
  }

  async submitAnswer(id: string, answer: Answer): Promise<number> {
    const scope = span(
      this.log.withMetadata({
        answerId: id,
      }),
      "Answer submitted",
    );

    const { data } = await this.#client.post("/answer", typia.misc.assertPrune(answer)).catch((e) => {
      if (isAxiosError(e)) throw new ServerUnavailableError(e);

      throw e;
    });

    const { revision } = typia.assert<AnswerResponse>(data);

    scope.end();

    return revision;
  }

  async init() {
    const client = axios.create({
      baseURL: this.#baseURL,
      headers: {
        "Procon-Token": this.#token,
      },
      adapter: "fetch",
    });

    const { request, response } = axiosLoggingInterceptor(this.log);

    client.interceptors.request.use(request);
    client.interceptors.response.use(response);

    this.#client = client;
  }

  async start() {
    StateManager.instance.state$.subscribe(async (state) => {
      if (state.stateName === IdleState.stateName) {
        const [id, problem] = await this.pollProblem();

        StateManager.instance.setState(new SolvingState(id, problem));

        return;
      }

      if (state.stateName === DoneState.stateName) {
        const doneState = state as DoneState;

        const revision = await this.submitAnswer(doneState.id, doneState.answer);

        setTimeout(() => {
          StateManager.instance.setState(IdleState.instance);
        }, 1000);
      }
    });
  }
}
