import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  HStack,
  Heading,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInput,
  Slider,
  SliderMark,
  Text,
  VStack,
  useBoolean,
} from "@yamada-ui/react";
import { useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type Props = Readonly<{
  currentTurn: number;
  turns: number;
  onChangeTurn: (turn: number) => void;
  showDebugOverlay: boolean;
  onChangeDebugOverlay: (showDebugOverlay: boolean) => void;
  onChangeInterval: (interval: number) => void;
}>;

export const TimelineCard = ({
  currentTurn,
  turns: actualTurns,
  onChangeTurn,
  showDebugOverlay,
  onChangeDebugOverlay,
  onChangeInterval,
}: Props) => {
  const [isPlaying, { off: pause, toggle: togglePlaying }] = useBoolean(false);
  const [rawInterval, setRawInterval] = useState<string>("");
  const interval = rawInterval === "" ? null : Number(rawInterval);
  const oldInterval = useRef(interval);

  useEffect(() => {
    if (interval !== oldInterval.current) {
      oldInterval.current = interval;

      onChangeInterval(interval ?? 0);
    }
  }, [interval, onChangeInterval]);

  const turns = actualTurns - 1; // turn starts from 0

  if (currentTurn === turns && isPlaying) pause();

  useEffect(() => {
    if (isPlaying && interval !== null) {
      const timer = setInterval(() => {
        onChangeTurn(clamp(currentTurn + 1, 0, turns));
      }, interval);

      return () => clearInterval(timer);
    }
  });

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading as="h2" size="md" fontWeight="semibold">
          Timeline
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack px={2} py={4}>
          <HStack>
            <Button
              colorScheme={isPlaying ? undefined : "primary"}
              onClick={togglePlaying}
              isDisabled={interval === null || turns <= 0}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <InputGroup maxW="160px">
              <InputLeftElement>
                <p>/</p>
              </InputLeftElement>

              <NumberInput
                placeholder="1000"
                fontFeatureSettings="'tnum'"
                min={100}
                max={999999}
                step={100}
                value={rawInterval}
                onChange={setRawInterval}
              />

              <InputRightElement mr={4}>
                <p>ms</p>
              </InputRightElement>
            </InputGroup>
            <ButtonGroup isAttached isDisabled={turns <= 0} variant="outline" gap="sm">
              <Button onClick={() => onChangeTurn(clamp(currentTurn - 1, 0, turns))} isDisabled={currentTurn === 0}>
                -1
              </Button>
              <Button onClick={() => onChangeTurn(clamp(currentTurn - 10, 0, turns))}>-10</Button>
              <Button onClick={() => onChangeTurn(clamp(currentTurn + 10, 0, turns))}>+10</Button>
              <Button
                onClick={() => onChangeTurn(clamp(currentTurn + 1, 0, turns))}
                isDisabled={currentTurn === turns || turns <= 0}
              >
                +1
              </Button>
            </ButtonGroup>
            <Checkbox isChecked={showDebugOverlay} onChange={() => onChangeDebugOverlay(!showDebugOverlay)}>
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
                {currentTurn}
              </span>
            </Text>
            <Slider
              value={currentTurn}
              min={0}
              max={Math.max(0, turns)}
              onChange={onChangeTurn}
              isDisabled={turns <= 0}
            >
              {turns > 0 && (
                <SliderMark value={0} w={10} ml={-5}>
                  {0}
                </SliderMark>
              )}
              {Array.from({ length: turns / 20 }, (_, i) => i * 20).map((value) => (
                <SliderMark key={value} value={value} w={10} ml={-5}>
                  {value}
                </SliderMark>
              ))}
              {turns > 0 && (
                <SliderMark value={turns} w={10} ml={-5}>
                  {turns}
                </SliderMark>
              )}
            </Slider>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
