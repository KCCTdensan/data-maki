import { Box } from "@yamada-ui/react";
import { type CSSProperties, memo } from "react";

export const isCell = (cell: string): cell is "0" | "1" | "2" | "3" => ["0", "1", "2", "3"].includes(cell);

type Props = {
  cell: "0" | "1" | "2" | "3";
  size?: string;
  borderColor?: string;
  style?: CSSProperties;
};

const colors = {
  "0": "blue",
  "1": "red",
  "2": "green",
  "3": "yellow",
};

export const BoardCell = memo(function BoardCell({
  cell,
  size,
  borderColor = "var(--mauve-2)",
  style,
  ...rest
}: Props) {
  return (
    <Box
      textAlign="center"
      verticalAlign="middle"
      border={`1px solid ${borderColor}`}
      fontWeight="medium"
      fontFeatureSettings='"tnum"'
      fontSize={`calc(${size} / 2)`}
      minWidth={size}
      minHeight={size}
      backgroundColor={`var(--${colors[cell]}-5)`}
      color="var(--cell-color)"
      style={style}
      {...rest}
    >
      {cell}
    </Box>
  );
});
