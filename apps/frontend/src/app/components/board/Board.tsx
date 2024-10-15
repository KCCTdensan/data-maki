import type { CellsMark } from "@data-maki/schemas";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, ScrollArea } from "@yamada-ui/react";
import { Fragment, useCallback, useRef } from "react";
import { ScrollSyncNode } from "scroll-sync-react";
import { BoardCell } from "./Cell";

type Props = Readonly<{
  board: string[];
  width: number;
  height: number;
  marks?: CellsMark;
  zoomLevel: number;
  scrollGroup?: string;
}>;

const shouldMark = (marks: CellsMark, x: number, y: number) => {
  if (marks.type === "row" && marks.index === y) return true;
  if (marks.type === "column" && marks.index === x) return true;
  return marks.type === "point" && marks.index === y && marks.index2 === x;
};

export const Board = ({ board, width, height, zoomLevel, marks, scrollGroup }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const estimateSize = useCallback(() => 32 * zoomLevel, [zoomLevel]);
  const getItemKey = useCallback((index: number) => `${index}-${zoomLevel}`, [zoomLevel]);

  const rowVirtualizer = useVirtualizer({
    count: height,
    getScrollElement: () => scrollRef.current,
    estimateSize,
    getItemKey,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: width,
    getScrollElement: () => scrollRef.current,
    estimateSize,
    getItemKey,
    overscan: 5,
  });

  // FIXME: I cannot found better impls
  const getElements = () => (
    <Box
      width={`${columnVirtualizer.getTotalSize()}px`}
      height={`${rowVirtualizer.getTotalSize()}px`}
      position="relative"
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <Fragment key={virtualRow.key}>
          {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const cell = board[virtualRow.index][virtualColumn.index] as "0" | "1" | "2" | "3";
            const borderColor =
              marks && shouldMark(marks, virtualColumn.index, virtualRow.index) ? "var(--orange-8)" : "var(--mauve-2)";

            return (
              <BoardCell
                key={virtualColumn.key}
                cell={cell}
                size={`${virtualColumn.size}px`}
                borderColor={borderColor}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </Fragment>
      ))}
    </Box>
  );

  if (scrollGroup) {
    return (
      <ScrollSyncNode group={scrollGroup}>
        <ScrollArea ref={scrollRef} maxW="100%" aspectRatio="1 / 1" type="always">
          {getElements()}
        </ScrollArea>
      </ScrollSyncNode>
    );
  }

  return (
    <ScrollArea ref={scrollRef} maxW="100%" aspectRatio="1 / 1" type="always">
      {getElements()}
    </ScrollArea>
  );
};
