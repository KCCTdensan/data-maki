import { connectionStatusAtom } from "@/atoms/client";
import type { Board } from "@data-maki/schemas";
import { Box, Card, CardBody, CardHeader, Grid, Heading, Text } from "@yamada-ui/react";
import { useAtomValue } from "jotai";

type Props = {
  board: Board;
};

export const StatsCard = ({ board }: Props) => {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  return (
    <Card as="section" variant="outline" w="100%" h="100%">
      <CardHeader>
        <Heading as="h2" size="md" fontWeight="semibold">
          Stats
        </Heading>
      </CardHeader>
      {connectionStatus === "connected" ? (
        <CardBody>
          <Box as="table" fontFeatureSettings='"tnum"'>
            <tbody>
              <tr>
                <td>State:</td>
                <td>Idle</td>
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
                <td>Turn:</td>
                <td>TODO!()</td>
              </tr>
              <tr>
                <td>Time:</td>
                <td>TODO!()</td>
              </tr>
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
