import { Card, CardBody, CardHeader, Grid, HStack, Heading, Spacer, Text } from "@yamada-ui/react";

export const MAX_WORKERS = 16;

type WorkerGridItemProps = Readonly<{
  children?: string | null;
}>;

const WorkerGridItem = ({ children }: WorkerGridItemProps) => {
  return (
    <Text
      display="block"
      bg={children === null ? "var(--mauve-3)" : "var(--mauve-2)"}
      w="4rem"
      h="3rem"
      textAlign="center"
      lineHeight="3rem"
    >
      {children === null ? "..." : children}
    </Text>
  );
};

type Props = Readonly<{
  results: (number | null)[];
}>;

export const WorkersCard = ({ results }: Props) => (
  <Card variant="outline">
    <CardHeader>
      <HStack w="100%">
        <Heading as="h2" size="md" fontWeight="semibold">
          Workers
        </Heading>
        <Spacer />
        <Text textAlign="end">Total: {results.length}</Text>
      </HStack>
    </CardHeader>
    <CardBody>
      <Grid templateColumns="repeat(4, 1fr)" autoRows="1fr" gap="1px" placeItems="center" bg="var(--mauve-8)" mx="auto">
        {Array.from({ length: MAX_WORKERS }).map((_, i) => {
          const result = results.at(i);
          const content = result === undefined ? undefined : result === null ? null : result.toString();

          return <WorkerGridItem key={`${i}-${content}`}>{content}</WorkerGridItem>;
        })}
      </Grid>
    </CardBody>
  </Card>
);
