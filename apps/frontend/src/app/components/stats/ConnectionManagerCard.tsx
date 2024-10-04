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

export const ConnectionManagerCard = () => {
  return (
    <Card as="section" variant="outline" w="100%">
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
            <Input placeholder="https://localhost:3000" />
            <Button paddingInline={4} colorScheme="primary">
              Connect
            </Button>
          </Flex>
          <Text color="red" visibility="hidden">
            No errors found
          </Text>
        </FormControl>
        <HStack w="100%">
          <Text fontWeight="medium">Status</Text>
          <Spacer />
          <Tag colorScheme="success">Online</Tag>
        </HStack>
      </CardBody>
    </Card>
  );
};
