import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { LogLayer } from "loglayer";

export const axiosLoggingInterceptor = (log: LogLayer, requestName = "Request", responseName = "Response") =>
  ({
    request: (request: InternalAxiosRequestConfig) => {
      log
        .withMetadata({
          method: request.method?.toUpperCase(),
          url: request.url,
        })
        .info(requestName);

      return request;
    },
    response: (response: AxiosResponse) => {
      log
        .withMetadata({
          status: response.status,
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
        })
        .info(`${responseName}: ${response.statusText}`);

      return response;
    },
  }) as const;
