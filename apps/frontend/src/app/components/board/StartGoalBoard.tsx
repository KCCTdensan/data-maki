import type { Board as BoardSchema, ExtraOpInfo } from "@data-maki/schemas";
import { Grid } from "@yamada-ui/react";
import { Board } from "./Board";

type Props = Readonly<{
  board: BoardSchema;
  extraInfo?: ExtraOpInfo;
  syncScroll?: boolean;
  zoomLevel: number;
}>;

export const StartGoalBoard = ({ board, extraInfo, syncScroll, zoomLevel }: Props) => {
  if (syncScroll) {
    return (
      <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
        <Board
          board={board.start}
          width={board.width}
          height={board.height}
          extraInfo={extraInfo}
          zoomLevel={zoomLevel}
          scrollGroup="board"
        />
        <Board board={board.goal} width={board.width} height={board.height} zoomLevel={zoomLevel} scrollGroup="board" />
      </Grid>
    );
  }

  return (
    <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
      <Board
        board={board.start}
        width={board.width}
        height={board.height}
        extraInfo={extraInfo}
        zoomLevel={zoomLevel}
      />
      <Board board={board.goal} width={board.width} height={board.height} zoomLevel={zoomLevel} />
    </Grid>
  );
};
