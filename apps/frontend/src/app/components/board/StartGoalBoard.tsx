import type { Board as BoardSchema } from "@data-maki/schemas";
import { Grid } from "@yamada-ui/react";
import { ScrollSyncNode } from "scroll-sync-react";
import { Board } from "./Board";

type Props = Readonly<{
  board: BoardSchema;
  syncScroll?: boolean;
  zoomLevel: number;
}>;

export const StartGoalBoard = ({ board, syncScroll, zoomLevel }: Props) => {
  if (syncScroll) {
    return (
      <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
        <Board
          board={board.start}
          width={board.width}
          height={board.height}
          zoomLevel={zoomLevel}
          scrollGroup="board"
        />
        <Board board={board.goal} width={board.width} height={board.height} zoomLevel={zoomLevel} scrollGroup="board" />
      </Grid>
    );
  }

  return (
    <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
      <Board board={board.start} width={board.width} height={board.height} zoomLevel={zoomLevel} />
      <Board board={board.goal} width={board.width} height={board.height} zoomLevel={zoomLevel} />
    </Grid>
  );
};
