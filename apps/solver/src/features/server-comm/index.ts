import type { Answer, AnswerResponse, Question } from "@data-maki/schemas";
import axios, { type AxiosInstance } from "axios";
import typia from "typia";
import { FeatureBase } from "../base";

export const SERVER_COMMUNICATOR_POLL_INTERVAL = 1000;

export class ServerCommunicatorFeature extends FeatureBase {
  readonly #baseURL: string;
  readonly #token: string;
  #client!: AxiosInstance;

  constructor(baseURL: string, token: string) {
    super("Server Communicator");

    this.#baseURL = baseURL;
    this.#token = token;
  }

  async ping() {
    const correctStatus = [200, 403];

    try {
      await this.#client.get("/problem", {
        validateStatus: (status) => correctStatus.includes(status),
      });
    } catch (error) {
      console.error("Server connection is unhealthy:", error);

      throw error;
    }
  }

  async pollProblem(): Promise<Question> {
    const correctStatus = [200, 403];

    let tries = 1;

    while (true) {
      console.info(`Polling problem (try ${tries})...`);

      const { data } = await this.#client.get("/problem", {
        validateStatus: (status) => correctStatus.includes(status),
      });

      if (data) {
        console.info("Received problem:", data);

        return typia.assert<Question>(data);
      }

      tries++;

      await new Promise((resolve) => setTimeout(resolve, SERVER_COMMUNICATOR_POLL_INTERVAL));
    }
  }

  async submitAnswer(answer: Answer): Promise<number> {
    const id = ""; //TODO
    console.info("Submitting answer:", id);

    const { data } = await this.#client.post("/answer", typia.misc.assertPrune(answer));
    const { revision } = typia.assert<AnswerResponse>(data);

    console.info(`Answer submitted, revision: ${revision}`);

    return revision;
  }

  init() {
    this.#client = axios.create({
      baseURL: this.#baseURL,
      headers: {
        "Procon-Token": this.#token,
      },
      adapter: "fetch",
    });
  }

  async start() {
    await this.ping();

    console.info("Server connection is healthy");
  }
}
