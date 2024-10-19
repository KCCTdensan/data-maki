import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  HStack,
  Heading,
  InputGroup,
  InputRightElement,
  NumberInput,
  Select,
  Switch,
  VStack,
  useBoolean,
  useNotice,
} from "@yamada-ui/react";
import { useState } from "react";
import { MockServerConnectionCard } from "../components/mock-server/MockServerConnectionCard";

// Code from apps/frontend/src/app/routes/mock.tsx
type GenerationKindStart = "all-random" | "gen-random" | "column-seq" | "column-seq-reverse" | "column-group-shuffle";

const generationKindStarts: GenerationKindStart[] = [
  "all-random",
  "gen-random",
  "column-seq",
  "column-seq-reverse",
  "column-group-shuffle",
] as const;

type GenerationKindGoal =
  | "all-random"
  | "sort-asc"
  | "sort-desc"
  | "shuffle"
  | "column-seq"
  | "column-seq-reverse"
  | "partial-single-swap"
  | "partial-block-swap";

const generationKindGoals: GenerationKindGoal[] = [
  "all-random",
  "sort-asc",
  "sort-desc",
  "shuffle",
  "column-seq",
  "column-seq-reverse",
  "partial-single-swap",
  "partial-block-swap",
] as const;

export default function Page() {
  const [url, setUrl] = useState("");
  const [randomWidth, { toggle: toggleRandomWidth }] = useBoolean(true);
  const [rawWidth, setRawWidth] = useState("");
  const width = randomWidth || Number.isNaN(rawWidth) ? 0 : Number(rawWidth);
  const [randomHeight, { toggle: toggleRandomHeight }] = useBoolean(true);
  const [rawHeight, setRawHeight] = useState("");
  const height = randomHeight || Number.isNaN(rawHeight) ? 0 : Number(rawHeight);
  const [genKindStart, setGenKindStart] = useState<GenerationKindStart>("all-random");
  const [genKindGoal, setGenKindGoal] = useState<GenerationKindGoal>("all-random");
  const [rawWaitDuration, setRawWaitDuration] = useState("5");
  const waitDuration = Number.isNaN(rawWaitDuration) ? 0 : Number(rawWaitDuration);
  const notice = useNotice();

  return (
    <Form
      onSubmit={async () => {
        const parsedUrl = new URL("/settings", url);

        try {
          const res = await fetch(parsedUrl.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
            body: JSON.stringify({
              widthRandom: randomWidth,
              heightRandom: randomHeight,
              width,
              height,
              genKindStart,
              genKindGoal,
              waitDuration,
            }),
          });

          if (!res.ok) {
            notice({
              title: "Failed to apply settings",
              description: `Mock server returned ${res.status}: ${res.statusText}`,
              status: "error",
            });

            return;
          }
        } catch (e) {
          if (e instanceof Error)
            notice({ title: "Failed to apply settings", description: e.message, status: "error" });
          else {
            notice({ title: "Failed to apply settings", status: "error" });

            console.error(e);
          }

          return;
        }

        notice({ title: "Settings applied", description: "Settings applied successfully", status: "success" });
      }}
    >
      <Grid templateColumns="auto 1fr" autoRows="1fr" gap="md">
        <MockServerConnectionCard url={url} onChangeUrl={setUrl} />
      </Grid>
      <Box as="section" minH="100vh" mt={8}>
        <Heading as="h2" size="lg" fontWeight="medium" lineHeight={1.2}>
          Mock Server Settings
        </Heading>
        <VStack gap="md">
          <HStack gap="lg" align="end" mt={4}>
            <VStack>
              <Switch isChecked={randomWidth} onChange={toggleRandomWidth}>
                Random Width
              </Switch>
              <FormControl label="Width" isDisabled={randomWidth}>
                <NumberInput
                  placeholder="128"
                  fontFeatureSettings="'tnum'"
                  min={1}
                  max={256}
                  value={rawWidth}
                  onChange={setRawWidth}
                  required={!randomWidth}
                />
              </FormControl>
            </VStack>
            <VStack>
              <Switch isChecked={randomHeight} onChange={toggleRandomHeight}>
                Random Height
              </Switch>
              <FormControl label="Height" isDisabled={randomHeight}>
                <NumberInput
                  placeholder="128"
                  fontFeatureSettings="'tnum'"
                  min={1}
                  max={256}
                  value={rawHeight}
                  onChange={setRawHeight}
                  required={!randomHeight}
                />
              </FormControl>
            </VStack>
            <VStack>
              <FormControl label="Start Generation">
                <Select
                  name="genKindStart"
                  placeholderInOptions={false}
                  items={generationKindStarts.map((kind) => ({ value: kind, label: kind }))}
                  value={genKindStart}
                  onChange={(value) => setGenKindStart(value as GenerationKindStart)}
                />
              </FormControl>
            </VStack>
            <VStack>
              <FormControl label="Goal Generation">
                <Select
                  name="genKindGoal"
                  placeholderInOptions={false}
                  items={generationKindGoals.map((kind) => ({ value: kind, label: kind }))}
                  value={genKindGoal}
                  onChange={(value) => setGenKindGoal(value as GenerationKindGoal)}
                />
              </FormControl>
            </VStack>
            <VStack>
              <FormControl label="Wait Duration">
                <InputGroup>
                  <NumberInput
                    placeholder="10"
                    fontFeatureSettings="'tnum'"
                    min={0}
                    value={rawWaitDuration}
                    onChange={setRawWaitDuration}
                    required
                  />

                  <InputRightElement mr={4}>
                    <p>s</p>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
          </HStack>
          <HStack gap="md">
            <Button colorScheme="primary" type="submit">
              Apply
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Form>
  );
}
