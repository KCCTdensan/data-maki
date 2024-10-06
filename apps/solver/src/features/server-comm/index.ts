import type { Answer, AnswerResponse, Question } from "@data-maki/schemas";
import axios, { type AxiosInstance } from "axios";
import type { LogLayer } from "loglayer";
import typia from "typia";
import { span } from "../../logging";
import { axiosLoggingInterceptor } from "../../logging/third-party/axios.ts";
import { FeatureBase } from "../base";

export const SERVER_COMMUNICATOR_POLL_INTERVAL = 1000;

export class ServerCommunicatorFeature extends FeatureBase {
  readonly #baseURL: string;
  readonly #token: string;
  #client!: AxiosInstance;

  constructor(log: LogLayer, baseURL: string, token: string) {
    super("Server Communicator", log);

    this.#baseURL = baseURL;
    this.#token = token;
  }

  async ping() {
    const correctStatus = [200, 403];

    await this.#client.get("/problem", {
      validateStatus: (status) => correctStatus.includes(status),
    });
  }

  async pollProblem(): Promise<Question> {
    const correctStatus = [200, 403];

    let tries = 1;

    while (true) {
      this.log
        .withMetadata({
          tries,
        })
        .info("Polling problem...");

      const { data } = await this.#client.get("/problem", {
        validateStatus: (status) => correctStatus.includes(status),
      });

      if (data) {
        this.log
          .withMetadata({
            tries,
            data,
          })
          .info("Received problem");

        return typia.assert<Question>(data);
      }

      tries++;

      await new Promise((resolve) => setTimeout(resolve, SERVER_COMMUNICATOR_POLL_INTERVAL));
    }
  }

  async submitAnswer(answer: Answer): Promise<number> {
    const id = ""; //TODO
    const scope = span(
      this.log.withMetadata({
        answerId: id,
      }),
      "Answer submitted",
    );

    const { data } = await this.#client.post("/answer", typia.misc.assertPrune(answer));
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

    await this.ping();

    this.log.info("Server connection is healthy");
  }

  async start() {}
}
