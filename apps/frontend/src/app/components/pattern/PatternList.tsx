import { type Pattern as PatternSchema, fixedPatterns } from "@data-maki/schemas";
import { Card, CardBody, FormControl, HStack, Option, ScrollArea, Select } from "@yamada-ui/react";
import { Fragment, useState } from "react";
import { Pattern } from "./Pattern";

type PatternType = "general" | "fixed";

type Props = Readonly<{
  patterns: PatternSchema[];
}>;

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
        <ScrollArea innerProps={{ as: CardBody }}>
          <HStack gap="md">
            {(patternType === "general" ? patterns : fixedPatterns.filter((_, i) => i < 7)).map((pattern, i, arr) => (
              <Fragment key={pattern.p}>
                <Pattern pattern={pattern} />
                {patternType === "fixed" && i === arr.length - 1 && <p>...</p>}
              </Fragment>
            ))}
          </HStack>
        </ScrollArea>
      </Card>
    </HStack>
  );
};
