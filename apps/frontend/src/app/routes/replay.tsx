import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  FileInput,
  Flex,
  FormControl,
  Grid,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Slider,
  SliderMark,
  Spacer,
  Text,
  VStack,
  useBoolean,
} from "@yamada-ui/react";
import { useState } from "react";
import { BoardCell } from "../components/board/Cell";
import { ZoomLevelSlider } from "../components/board/ZoomLevelSlider";
import { PatternList } from "../components/pattern/PatternList";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function Page() {
  const turns = 124;
  const [turn, setTurn] = useState(0);
  const [isPlaying, { toggle: togglePlaying }] = useBoolean(false);
  const [showDebugOverlay, { toggle: toggleDebugOverlay }] = useBoolean(true);
  const [hideCellNumber, { toggle: toggleHideCellNumber }] = useBoolean(false);
  const [syncScroll, { toggle: toggleSyncScroll }] = useBoolean(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const board = undefined;

  return (
    <>
      <Grid templateColumns="auto 1fr" autoRows="1fr" gap="md">
        <Card variant="outline" minW="240px">
          <CardHeader>
            <Heading as="h2" size="md" fontWeight="semibold">
              Input File
            </Heading>
          </CardHeader>
          <CardBody>
            <FormControl label="File to view replay">
              <FileInput
                placeholder="out_2024-10-13_001"
                accept="application/json"
                format={({ name }) => name.substring(0, name.lastIndexOf("."))}
              />
            </FormControl>
          </CardBody>
        </Card>
        <Card variant="outline">
          <CardHeader>
            <Heading as="h2" size="md" fontWeight="semibold">
              Timeline
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack px={2} py={4}>
              <HStack>
                <Button colorScheme={isPlaying ? undefined : "primary"} onClick={togglePlaying}>
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <InputGroup maxW="120px">
                  <InputLeftElement>
                    <p>/</p>
                  </InputLeftElement>

                  <Input placeholder="1000" />

                  <InputRightElement>
                    <p>ms</p>
                  </InputRightElement>
                </InputGroup>
                <ButtonGroup isAttached variant="outline" gap="sm">
                  <Button onClick={() => setTurn((prev) => clamp(prev - 10, 0, turns))}>-10</Button>
                  <Button onClick={() => setTurn((prev) => clamp(prev + 10, 0, turns))}>+10</Button>
                </ButtonGroup>
                <Checkbox isChecked={showDebugOverlay} onChange={toggleDebugOverlay}>
                  Debug overlay
                </Checkbox>
              </HStack>
              <HStack alignItems="center">
                <Text
                  whiteSpace="nowrap"
                  style={{
                    fontFeatureSettings: "'tnum'",
                  }}
                >
                  Turn:{" "}
                  <span
                    style={{
                      display: "inline-block",
                      textAlign: "end",
                      minWidth: `${turns.toString().length}ch`,
                    }}
                  >
                    {turn}
                  </span>
                </Text>
                <Slider value={turn} min={0} max={turns} onChange={setTurn}>
                  <SliderMark value={0} w={10} ml={-5}>
                    {0}
                  </SliderMark>
                  {Array.from({ length: turns / 20 }, (_, i) => i * 20).map((value) => (
                    <SliderMark key={value} value={value} w={10} ml={-5}>
                      {value}
                    </SliderMark>
                  ))}
                  <SliderMark value={turns} w={10} ml={-5}>
                    {turns}
                  </SliderMark>
                </Slider>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Grid>
      <section>
        <Heading as="h2" size="lg" fontWeight="medium" lineHeight={1.2}>
          Board
        </Heading>
        {board ? (
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
              {/*<PatternList patterns={general.patterns} />*/}
            </section>
          </>
        ) : (
          <Text>Select a replay file to view the board</Text>
        )}
      </section>
    </>
  );
}
