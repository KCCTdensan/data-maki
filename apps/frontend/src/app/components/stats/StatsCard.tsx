import { localizeSolverEvent } from "@/lib/events";
import { type Board, isSolverEvent, isUIMessageEvent } from "@data-maki/schemas";
import { Box, Card, CardBody, CardHeader, Grid, Heading, Text } from "@yamada-ui/react";
import { useAtomValue } from "jotai";
import { connectionStatusAtom, eventStreamAtom } from "../../atoms/client";
import { workersAtom } from "../../atoms/solver";
import { RealtimeDuration } from "../date/RealtimeDuration";

type Props = Partial<{
  solveId: string;
  board: Board;
  startedAt: Date;
}>;

export const StatsCard = ({ solveId, board, startedAt }: Props) => {
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const currentEvent = useAtomValue(eventStreamAtom);
  const workers = useAtomValue(workersAtom);

  return (
    <Card as="section" variant="outline" w="100%" h="100%">
      <CardHeader>
        <Heading as="h2" size="md" fontWeight="semibold">
          Stats
        </Heading>
      </CardHeader>
      {connectionStatus === "connected" && isUIMessageEvent(currentEvent) ? (
        <CardBody>
          <Box as="table" fontFeatureSettings='"tnum"'>
            <tbody>
              {isSolverEvent(currentEvent) && board && startedAt ? (
                <>
                  <tr>
                    <td>State:</td>
                    <td>{localizeSolverEvent(currentEvent)}</td>
                  </tr>
                  <tr>
                    <td>ID:</td>
                    <td>{solveId}</td>
                  </tr>
                  <tr>
                    <td>Width:</td>
                    <td>{board.width}</td>
                  </tr>
                  <tr>
                    <td>Height:</td>
                    <td>{board.height}</td>
                  </tr>
                  <tr>
                    <td>Time:</td>
                    <td>
                      <RealtimeDuration startDate={startedAt} interval={800} />
                    </td>
                  </tr>
                  <tr>
                    <td>Shortest turns:</td>
                    <td>
                      {workers.length === 0 || workers.every((worker) => worker === null)
                        ? "Nothing"
                        : workers.reduce(
                            (acc, w) => (w ? Math.min(acc, w) : Number.POSITIVE_INFINITY),
                            Number.POSITIVE_INFINITY,
                          )}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>State:</td>
                    <td>Idle</td>
                  </tr>
                </>
              )}
            </tbody>
          </Box>
        </CardBody>
      ) : (
        <Grid placeItems="center" h="100%">
          <Text pb={6}>Connect to a solver to see stats</Text>
        </Grid>
      )}
    </Card>
  );
};
