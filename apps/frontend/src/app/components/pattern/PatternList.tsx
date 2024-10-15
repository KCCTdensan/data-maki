import { type Pattern as PatternSchema, fixedPatterns } from "@data-maki/schemas";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Card, CardBody, FormControl, HStack, Option, ScrollArea, Select } from "@yamada-ui/react";
import { Fragment, useRef, useState } from "react";
import { Pattern } from "./Pattern";

type PatternType = "general" | "fixed";

type Props = Readonly<{
  patterns: PatternSchema[];
}>;

export const PatternListInner = ({ patterns }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    gap: 12,
    count: patterns.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => patterns[i].width * 32,
    paddingEnd: 12,
    overscan: 2,
  });

  return (
    <ScrollArea ref={scrollRef} innerProps={{ as: CardBody }} minH="200px">
      <Box width={`${virtualizer.getTotalSize()}px`} h="100%" position="relative">
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const pattern = patterns[virtualItem.index];

          return (
            <Fragment key={virtualItem.key}>
              <Pattern
                pattern={pattern}
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
  const [patternType, setPatternType] = useState<PatternType>("general");

  return (
    <HStack w="100vw">
      <FormControl label="Type" w="15vw">
        <Select value={patternType} onChange={(value) => setPatternType(value as PatternType)}>
          <Option value={"general" satisfies PatternType}>General</Option>
          <Option value={"fixed" satisfies PatternType}>Fixed</Option>
        </Select>
      </FormControl>
      <Card variant="outline" w="75vw">
        <PatternListInner patterns={patternType === "general" ? patterns : fixedPatterns.slice(0, 7)} />
      </Card>
    </HStack>
  );
};
