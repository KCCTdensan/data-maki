import { css } from "@style/css";
import { Container, Flex, HStack, Heading, Spacer, Text } from "@yamada-ui/react";
import { NavLink } from "./NavLink";

export const Header = () => {
  return (
    <Container as="header" bg="var(--mauve-4)">
      <Flex align="center" gap="lg">
        <Heading fontWeight="semilight">Data Maki UI</Heading>
        <nav>
          <HStack as="ul" gap="md">
            <li>
              <NavLink to="/">UI</NavLink>
            </li>
            <li>
              <NavLink to="/replay">Replay</NavLink>
            </li>
            <li>
              <NavLink to="/mock">Mock Settings</NavLink>
            </li>
          </HStack>
        </nav>
        <Spacer />
        <Text>Procon 2024</Text>
      </Flex>
    </Container>
  );
};
