import { Grid, ScrollArea } from "@yamada-ui/react";
import { ScrollSyncNode } from "scroll-sync-react";
import { BoardCell, isCell } from "./Cell";

type Props = Readonly<{
  board: string[];
  width: number;
  zoomLevel: number;
}>;

export const Board = ({ board, width, zoomLevel }: Props) => (
  <ScrollSyncNode group="board">
    <ScrollArea maxW="100%" type="always">
      <Grid templateColumns={`repeat(${width}, 1fr)`}>
        {board.map((row, rowIndex) =>
          row.split("").map((cell, colIndex) => {
            if (!isCell(cell)) throw new Error(`Invalid cell: ${cell}`);

            return <BoardCell key={`${rowIndex}-${colIndex}-${cell}`} cell={cell} size={`calc(2rem * ${zoomLevel})`} />;
          }),
        )}
      </Grid>
    </ScrollArea>
  </ScrollSyncNode>
);
