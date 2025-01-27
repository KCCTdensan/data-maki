import { easyKatanuki } from "@data-maki/algorithm";
import type { Board as BoardSchema, ReplayInfo } from "@data-maki/schemas";
import { Box, Checkbox, Flex, Grid, HStack, Heading, SimpleGrid, Spacer, Text, useBoolean } from "@yamada-ui/react";
import { type CSSProperties, useMemo, useState } from "react";
import { ScrollSync } from "scroll-sync-react";
import { useDebounce } from "use-debounce";
import { Board } from "../components/board/Board";
import { BoardCell } from "../components/board/Cell";
import { StartGoalBoard } from "../components/board/StartGoalBoard";
import { ZoomLevelSlider } from "../components/board/ZoomLevelSlider";
import { PatternList } from "../components/pattern/PatternList";
import { InputFileCard } from "../components/replay/InputFileCard";
import { TimelineCard } from "../components/replay/TimelineCard";

export default function Page() {
  const [rawTurn, setTurn] = useState(0);
  const [interval, setIntervalState] = useState(400);

  const [turn] = useDebounce(rawTurn, Math.min(interval, 400), {
    leading: true /* Need this to prevent delayed updates when playing */,
  });

  const [replayInfo, setReplayInfo] = useState<ReplayInfo | null>(null);
  const [showDebugOverlay, setDebugOverlay] = useState(true);
  const [hideCellNumber, { toggle: toggleHideCellNumber }] = useBoolean(false);
  const [syncScroll, { toggle: toggleSyncScroll }] = useBoolean(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const [turns, boards] = useMemo(() => {
    if (!replayInfo) return [0, []];

    const boards: string[][] = [structuredClone(replayInfo.problem.board.start)];

    for (const [i, op] of replayInfo.answer.ops.entries()) {
      try {
        const afterBoard = easyKatanuki(replayInfo.problem, op);

        replayInfo.problem.board.start = afterBoard;

        boards.push(afterBoard);
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(`Failed to apply operation ${i + 1}`, { cause: e });
        }

        console.error(e);

        throw new Error(`Failed to apply operation ${i + 1}`);
      }
    }

    replayInfo.problem.board.start = boards[0];

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
  const delta =
    extraOpInfo?.delta ??
    replayInfo?.extraInfo
      ?.slice(0, turn)
      .reverse()
      .find((info) => info.delta);

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
          currentTurn={rawTurn}
          turns={turns}
          onChangeTurn={setTurn}
          showDebugOverlay={showDebugOverlay}
          onChangeDebugOverlay={setDebugOverlay}
          onChangeInterval={setIntervalState}
        />
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
        {(board && extraOpInfo) || turn === turns - 1 ? (
          <>
            <HStack>
              <Box as="section" my={4}>
                <Heading as="h3" size="md" fontWeight="regular" lineHeight={1}>
                  Delta
                </Heading>
                {delta && (
                  <Flex gap="md">
                    <HStack gap="md">
                      <BoardCell cell={"0"} size="32px" />
                      <Text>{delta[0]}</Text>
                    </HStack>
                    <HStack gap="md">
                      <BoardCell cell={"1"} size="32px" />
                      <Text>{delta[1]}</Text>
                    </HStack>
                    <HStack gap="md">
                      <BoardCell cell={"2"} size="32px" />
                      <Text>{delta[2]}</Text>
                    </HStack>
                    <HStack gap="md">
                      <BoardCell cell={"3"} size="32px" />
                      <Text>{delta[3]}</Text>
                    </HStack>
                  </Flex>
                )}
              </Box>
              <Box as="section" my={4}>
                <Heading as="h3" size="md" fontWeight="regular" lineHeight={1}>
                  Pattern
                </Heading>
                <p>{replayInfo.answer.ops[turn] ? replayInfo.answer.ops[turn].p : "None"}</p>
              </Box>
            </HStack>
            <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
              <Heading as="h3" size="md" fontWeight="regular" lineHeight={1}>
                Start
              </Heading>
              <Heading as="h3" size="md" fontWeight="regular" lineHeight={1}>
                Goal
              </Heading>
            </Grid>
            <ScrollSync>
              {turn === turns - 1 ? (
                <Grid templateColumns="1fr 1fr" w="100%" placeItems="start" gap={4}>
                  <Box />
                  <Board
                    board={replayInfo?.problem.board.goal}
                    width={replayInfo?.problem.board.width}
                    height={replayInfo?.problem.board.height}
                    zoomLevel={zoomLevel}
                  />
                </Grid>
              ) : (
                <StartGoalBoard
                  board={board}
                  zoomLevel={zoomLevel}
                  syncScroll={syncScroll}
                  extraInfo={showDebugOverlay ? extraOpInfo : undefined}
                />
              )}
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
              <PatternList patterns={replayInfo.problem.general.patterns} />
            </section>
          </>
        ) : (
          <Text>Select a replay file to view the board</Text>
        )}
      </Box>
    </>
  );
}
