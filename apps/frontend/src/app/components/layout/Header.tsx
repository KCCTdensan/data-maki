import { NavLink } from "@remix-run/react";
import { css } from "@style/css";
import { Container, Flex, HStack, Heading, Spacer, Text } from "@yamada-ui/react";

export const Header = () => {
  return (
    <Container as="header" bg="var(--mauve-4)">
      <Flex align="center" gap="lg">
        <Heading fontWeight="semilight">Data Maki UI</Heading>
        <nav>
          <HStack as="ul" gap="md">
            <li>
              <NavLink
                to="/"
                style={({ isActive, isPending }) => ({
                  transition: "all 0.2s",
                  color: isPending ? "var(--mauve-8)" : isActive ? "var(--mauve-12)" : "var(--blue-8)",
                  paddingInline: "16px",
                  paddingBlock: "10px",
                  backgroundColor: isActive ? "var(--mauve-6)" : "transparent",
                  borderRadius: "4px",
                })}
              >
                UI
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/replay"
                style={({ isActive, isPending }) => ({
                  transition: "all 0.2s",
                  color: isPending ? "var(--mauve-8)" : isActive ? "var(--mauve-12)" : "var(--blue-10)",
                  paddingInline: "16px",
                  paddingBlock: "10px",
                  backgroundColor: isActive ? "var(--mauve-6)" : "transparent",
                  borderRadius: "4px",
                })}
              >
                Replay
              </NavLink>
            </li>
          </HStack>
        </nav>
        <Spacer />
        <Text>Procon 2024</Text>
      </Flex>
    </Container>
  );
};
