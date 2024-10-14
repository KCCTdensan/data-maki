import { easyKatanuki } from "@data-maki/algorithm";
import type { Board as BoardSchema, ReplayInfo } from "@data-maki/schemas";
import { Box, Checkbox, Flex, Grid, HStack, Heading, SimpleGrid, Spacer, Text, useBoolean } from "@yamada-ui/react";
import { useMemo, useState } from "react";
import { BoardCell } from "../components/board/Cell";
import { ZoomLevelSlider } from "../components/board/ZoomLevelSlider";
import { PatternList } from "../components/pattern/PatternList";
import { InputFileCard } from "../components/replay/InputFileCard";
import { TimelineCard } from "../components/replay/TimelineCard";

export default function Page() {
  const [turn, setTurn] = useState(0);
  const [replayInfo, setReplayInfo] = useState<ReplayInfo | null>(null);
  const [showDebugOverlay, setDebugOverlay] = useState(true);
  const [hideCellNumber, { toggle: toggleHideCellNumber }] = useBoolean(false);
  const [syncScroll, { toggle: toggleSyncScroll }] = useBoolean(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const [turns, boards] = useMemo(() => {
    if (!replayInfo) return [0, []];

    const boards: string[][] = [replayInfo.problem.board.start];

    for (const op of replayInfo.answer.ops) {
      boards.push(easyKatanuki(replayInfo.problem, op));
    }

    return [replayInfo.answer.n + 1, boards] as const;
  }, [replayInfo]);

  const boardArray = boards?.[turn];

  const board: BoardSchema | null =
    boardArray && replayInfo
      ? {
          start: boardArray,
          goal: replayInfo.problem.board.goal,
          width: replayInfo.problem.board.width,
          height: replayInfo.problem.board.height,
        }
      : null;

  const extraOpInfo = replayInfo?.extraInfo[turn];

  return (
    <>
      <Grid templateColumns="auto 1fr" autoRows="1fr" gap="md">
        <InputFileCard
          onSetReplayInfo={(replayInfo) => {
            setReplayInfo(replayInfo);
            setTurn(0);
          }}
        />
        <TimelineCard
          currentTurn={turn}
          turns={turns}
          onChangeTurn={setTurn}
          showDebugOverlay={showDebugOverlay}
          onChangeDebugOverlay={setDebugOverlay}
        />
      </Grid>
      <section>
        <Heading as="h2" size="lg" fontWeight="medium" lineHeight={1.2}>
          Board
        </Heading>
        {board && extraOpInfo ? (
          <>
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
              <PatternList patterns={replayInfo.problem.general.patterns} />
            </section>
          </>
        ) : (
          <Text>Select a replay file to view the board</Text>
        )}
      </section>
    </>
  );
}
