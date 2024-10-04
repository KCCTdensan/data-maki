import type { Pattern as PatternSchema } from "@data-maki/schemas";
import { Grid } from "@yamada-ui/react";
import { BoardCell, isCell } from "../board/Cell";

type Props = Readonly<{
  pattern: PatternSchema;
}>;

export const Pattern = ({ pattern }: Props) => (
  <Grid templateColumns={`repeat(${pattern.width}, 1fr)`}>
    {pattern.cells.map((row, rowIndex) =>
      row.split("").map((cell, colIndex) => {
        if (!isCell(cell)) throw new Error(`Invalid cell: ${cell}`);

        return <BoardCell key={`${rowIndex}-${colIndex}-${cell}`} cell={cell} size="2rem" />;
      }),
    )}
  </Grid>
);
