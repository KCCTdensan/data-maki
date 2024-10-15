import { solverDataAtom, workersAtom } from "@/app/atoms/solver";
import { Box, Checkbox, Flex, Grid, HStack, Heading, SimpleGrid, Spacer, Text, useBoolean } from "@yamada-ui/react";
import { useAtomValue } from "jotai";
import { type CSSProperties, useState } from "react";
import { ScrollSync } from "scroll-sync-react";
import { BoardCell } from "../components/board/Cell";
import { StartGoalBoard } from "../components/board/StartGoalBoard";
import { ZoomLevelSlider } from "../components/board/ZoomLevelSlider";
import { PatternList } from "../components/pattern/PatternList";
import { ConnectionManagerCard } from "../components/stats/ConnectionManagerCard";
import { StatsCard } from "../components/stats/StatsCard";
import { WorkersCard } from "../components/workers/WorkersCard";

export default function Page() {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [hideCellNumber, { toggle: toggleHideCellNumber }] = useBoolean(false);
  const [syncScroll, { toggle: toggleSyncScroll }] = useBoolean(true);
  const { board, general, startedAt, solveId } = useAtomValue(solverDataAtom);
  const workers = useAtomValue(workersAtom);

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" autoRows="1fr" gap="md">
        <ConnectionManagerCard />
        <WorkersCard results={workers} />
        <StatsCard solveId={solveId} board={board} startedAt={startedAt} />
      </Grid>
      <Box
        as="section"
        minH="100vh"
        style={
          {
            "--cell-color": hideCellNumber ? "transparent" : "var(--mauve-10)",
            // color: `var(--${colors[cell]}-8)`,
            // color: `var(--mauve-10)`,
          } as CSSProperties
        }
      >
        <Heading as="h2" size="lg" fontWeight="medium" lineHeight={1.2}>
          Board
        </Heading>
        {board ? (
          <>
            <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
              <Heading as="h3" size="md" fontWeight="regular" lineHeight={1}>
                Start
              </Heading>
              <Heading as="h3" size="md" fontWeight="regular" lineHeight={1}>
                Goal
              </Heading>
            </Grid>
            <ScrollSync>
              <StartGoalBoard board={board} zoomLevel={zoomLevel} syncScroll={syncScroll} />
            </ScrollSync>
            <Grid as="section" templateColumns="auto 1fr auto" w="100%" mb={4}>
              <SimpleGrid columns={2} gap="md">
                <Checkbox isChecked={hideCellNumber} onChange={toggleHideCellNumber}>
                  Hide cell number
                </Checkbox>
                <Checkbox isChecked={syncScroll} onChange={toggleSyncScroll}>
                  Sync scroll
                </Checkbox>
                <Box opacity={hideCellNumber ? 1 : 0.4}>
                  <Heading as="h3" size="md" fontWeight="medium">
                    Legend
                  </Heading>
                  <Flex gap="md" wrap="wrap">
                    <HStack>
                      <BoardCell cell={"0"} size={"32px"} />
                      <Text>0</Text>
                    </HStack>
                    <HStack>
                      <BoardCell cell={"1"} size={"32px"} />
                      <Text>1</Text>
                    </HStack>
                    <HStack>
                      <BoardCell cell={"2"} size={"32px"} />
                      <Text>2</Text>
                    </HStack>
                    <HStack>
                      <BoardCell cell={"3"} size={"32px"} />
                      <Text>3</Text>
                    </HStack>
                  </Flex>
                </Box>
              </SimpleGrid>
              <Spacer />
              <ZoomLevelSlider value={zoomLevel} onChange={setZoomLevel} />
            </Grid>
            <section>
              <Heading as="h2" size="lg" fontWeight="medium">
                Patterns
              </Heading>
              <PatternList patterns={general.patterns} />
            </section>
          </>
        ) : (
          <Text>Waiting solver to start solving...</Text>
        )}
      </Box>
    </>
  );
}
