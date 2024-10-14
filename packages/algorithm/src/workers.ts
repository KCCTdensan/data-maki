import { isProduction } from "./env";

const dir = import.meta.dir;

export const spawnWorker = <T extends unknown[]>(fname: string, ...data: T) => {
  const normalizedFname = isProduction ? fname.replace(/\.ts$/, ".js") : fname;
  const worker = new Worker(`${dir}/workers/${normalizedFname}`);

  worker.onerror = (e) => {
    throw e;
  };

  worker.postMessage(data);

  worker.onmessage = (e) => {
    const { type, ...data } = e.data;

    switch (type) {
      case "dbg":
        console.debug(...data.args);

        break;
    }
  };

  return worker;
};
