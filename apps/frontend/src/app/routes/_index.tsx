import type { MetaFunction } from "@remix-run/node";
import { MainBoardView } from "../components/board/MainBoardView";

export const meta: MetaFunction = () => {
  return [{ title: "Data Maki UI" }];
};

export default function Index() {
  return (
    <>
      <MainBoardView />
    </>
  );
}
