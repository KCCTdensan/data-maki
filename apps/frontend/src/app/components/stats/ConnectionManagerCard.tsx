import {
  clientAtom,
  connectionStatusAtom,
  connectionStatusToColor,
  connectionStatusToText,
  eventStreamAtom,
} from "@/atoms/client";
import type { SolverApp } from "@data-maki/solver";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Spacer,
  Tag,
  Text,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";

export const ConnectionManagerCard = () => {
  const [endpoint, setEndpoint] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setClient = useSetAtom(clientAtom);
  const [connectionStatus, setConnectionStatus] = useAtom(connectionStatusAtom);
  const setEventStream = useSetAtom(eventStreamAtom);
  const loading = connectionStatus === "connecting";

  return (
    <Card as="section" variant="outline" w="100%" h="100%">
      <CardHeader>
        <HStack>
          <Heading as="h2" size="md" fontWeight="semibold">
            Connection
          </Heading>
          <Spacer />
        </HStack>
      </CardHeader>
      <CardBody>
        <FormControl label="UI Communicator Endpoint">
          <Flex gap={2}>
            <Input
              placeholder="http://localhost:3000"
              required
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
            <Button
              paddingInline={4}
              colorScheme="primary"
              disabled={loading}
              onClick={async () => {
                const client = hc<SolverApp>(endpoint);

                setClient(client);

                await setEventStream(
                  client.rpc.$url(),
                  () => setConnectionStatus("connecting"),
                  () => setConnectionStatus("connected"),
                  () => setConnectionStatus("idle"),
                  (e) => {
                    setConnectionStatus("error");

                    setError(e.message);
                    console.error(e);
                  },
                  (res) => {
                    setConnectionStatus("error");

                    setError(res.statusText);
                  },
                );
              }}
            >
              Connect
            </Button>
          </Flex>
          {error && <Text color="red">{error ? `Error: ${error}` : "No errors found"}</Text>}
        </FormControl>
        <Spacer />
        <HStack w="100%">
          <Text fontWeight="medium">Status</Text>
          <Spacer />
          <Tag colorScheme={connectionStatusToColor(connectionStatus)}>{connectionStatusToText(connectionStatus)}</Tag>
        </HStack>
      </CardBody>
    </Card>
  );
};
