import { type Pattern as PatternSchema, fixedPatterns } from "@data-maki/schemas";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Card, CardBody, FormControl, HStack, Option, ScrollArea, Select, Textarea } from "@yamada-ui/react";
import { Fragment, useRef, useState } from "react";
import { Pattern } from "./Pattern";

type Props = Readonly<{
  patterns: PatternSchema[];
}>;

export const PatternListInner = ({ patterns }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    gap: 12,
    count: patterns.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => 192,
    paddingEnd: 12,
    overscan: 2,
  });

  return (
    <ScrollArea ref={scrollRef} innerProps={{ as: CardBody }} minH="256px">
      <Box width={`${virtualizer.getTotalSize()}px`} h="100%" position="relative">
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const pattern = patterns[virtualItem.index];

          return (
            <Fragment key={virtualItem.key}>
              <Pattern
                pattern={pattern}
                size={192}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateX(${virtualItem.start}px)`,
                }}
              />
            </Fragment>
          );
        })}
      </Box>
    </ScrollArea>
  );
};

export const PatternList = ({ patterns }: Props) => {
  return (
    <>
      <Card variant="outline" w="100%">
        <PatternListInner patterns={patterns} />
      </Card>
      <FormControl mt={8} label="Memo">
        <Textarea autosize />
      </FormControl>
    </>
  );
};
