import { Card, CardBody, CardHeader, Heading, Input } from "@yamada-ui/react";

type Props = Readonly<{
  url: string;
  onChangeUrl: (url: string) => void;
}>;

export const MockServerConnectionCard = ({ url, onChangeUrl }: Props) => {
  return (
    <Card variant="outline">
      <CardHeader>
        <Heading size="md" fontWeight="medium">
          Mock Server Connection
        </Heading>
      </CardHeader>
      <CardBody>
        <Input placeholder="http://localhost:8080" value={url} onChange={(e) => onChangeUrl(e.target.value)} required />
      </CardBody>
    </Card>
  );
};
