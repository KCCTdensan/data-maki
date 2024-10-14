import type { ReplayInfo } from "@data-maki/schemas";
import { Card, CardBody, CardHeader, FileInput, FormControl, Heading, Text } from "@yamada-ui/react";
import { useCallback, useState } from "react";
import typia from "typia";

type Props = Readonly<{
  onSetReplayInfo: (replayInfo: ReplayInfo) => void | Promise<void>;
}>;

export const InputFileCard = ({ onSetReplayInfo }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const setFile = useCallback(
    (file: File | null) => {
      if (!file) return;

      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = () => {
        let replayInfo: ReplayInfo;

        try {
          replayInfo = typia.json.assertParse<ReplayInfo>(reader.result as string);
        } catch (e) {
          if (e instanceof Error) setError(e.message);
          else {
            setError("An unknown error occurred.");

            console.error(e);
          }
        }

        onSetReplayInfo(replayInfo);
      };
    },
    [onSetReplayInfo],
  );

  return (
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
            onChange={(files) => (files ? setFile(files[0]) : setFile(null))}
          />
        </FormControl>
        {error && <Text color="red">{error}</Text>}
      </CardBody>
    </Card>
  );
};
