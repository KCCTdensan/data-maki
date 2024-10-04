import type { Board } from "@data-maki/schemas";
import { Box, Card, CardBody, CardHeader, Heading } from "@yamada-ui/react";

type Props = {
  board: Board;
};

export const StatsCard = ({ board }: Props) => (
  <Card as="section" variant="outline" w="100%">
    <CardHeader>
      <Heading as="h2" size="md" fontWeight="semibold">
        Stats
      </Heading>
    </CardHeader>
    <CardBody>
      <Box as="table" fontFeatureSettings='"tnum"'>
        <tbody>
          <tr>
            <td>State:</td>
            <td>Solving</td>
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
  </Card>
);
