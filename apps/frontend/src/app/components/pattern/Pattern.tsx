import type { Pattern as PatternSchema } from "@data-maki/schemas";
import { type CSSProperties, useEffect, useRef } from "react";
import { isCell } from "../board/Cell";

type Props = Readonly<{
  pattern: PatternSchema;
  size?: number;
  style?: CSSProperties;
}>;

export const Pattern = ({ pattern, size = 192, style }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { width, height, cells } = pattern;

    const cellHeight = size / height;
    const cellWidth = size / width;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const cell = cells[i][j];

        if (isCell(cell)) {
          if (cell === "1") {
            ctx.fillStyle = "#000";
          } else {
            ctx.fillStyle = "#fff";
          }

          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }, [pattern, size]);

  return <canvas ref={canvasRef} width={size} height={size} style={style} />;
};
