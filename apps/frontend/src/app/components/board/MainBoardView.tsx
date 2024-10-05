import { Grid, Heading, Spacer, Text, VStack } from "@yamada-ui/react";
import { useState } from "react";
import { ScrollSync } from "scroll-sync-react";
import { PatternList } from "../pattern/PatternList";
import { ConnectionManagerCard } from "../stats/ConnectionManagerCard";
import { StatsCard } from "../stats/StatsCard";
import { Board } from "./Board";
import { ZoomLevelSlider } from "./ZoomLevelSlider";

const testBoard = {
  board: {
    width: 18,
    height: 4,
    start: ["220103220102201033", "213032130321303333", "022103022100221033", "322033322033220333"],
    goal: ["000000000000000000", "111222111221112222", "222233222232222333", "333333333333333333"],
  },
  general: {
    n: 2,
    patterns: [
      {
        p: 25,
        width: 4,
        height: 2,
        cells: ["0111", "1001"],
      },
      {
        p: 26,
        width: 2,
        height: 2,
        cells: ["10", "01"],
      },
    ],
  },
};

export const MainBoardView = () => {
  const [zoomLevel, setZoomLevel] = useState(1.0);

  return (
    <>
      <Grid templateColumns="1fr 1fr" autoRows="1fr" gap="md">
        <ConnectionManagerCard />
        <StatsCard board={testBoard.board} />
      </Grid>
      <VStack as="section" h="100vh">
        <Heading as="h2" size="lg" fontWeight="medium" lineHeight={1.2}>
          Board
        </Heading>
        {false ? (
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
              <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
                <Board board={testBoard.board.start} width={testBoard.board.width} zoomLevel={zoomLevel} />
                <Board board={testBoard.board.goal} width={testBoard.board.width} zoomLevel={zoomLevel} />
              </Grid>
            </ScrollSync>
            <Grid as="section" templateColumns="1fr auto" w="100%" mb={4}>
              <Spacer />
              <ZoomLevelSlider value={zoomLevel} onChange={setZoomLevel} />
            </Grid>
            <section>
              <Heading as="h2" size="lg" fontWeight="medium">
                Patterns
              </Heading>
              <PatternList patterns={testBoard.general.patterns} />
            </section>
            ) : (
            <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
              <Board board={testBoard.board.start} width={testBoard.board.width} zoomLevel={zoomLevel} />
              <Board board={testBoard.board.goal} width={testBoard.board.width} zoomLevel={zoomLevel} />
            </Grid>
          </>
        ) : (
          <Text>Waiting solver to start solving...</Text>
        )}
      </VStack>
    </>
  );
};
