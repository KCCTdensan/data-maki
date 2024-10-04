import { Container, Flex, Heading, Spacer, Text } from "@yamada-ui/react";

export const Header = () => (
  <Container as="header" bg="var(--mauve-4)">
    <Flex align="center">
      <Heading fontWeight="semilight">Data Maki UI</Heading>
      <Spacer />
      <Text>Procon 2024</Text>
    </Flex>
  </Container>
);
