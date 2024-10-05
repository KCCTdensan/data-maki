import { Outlet, Scripts } from "@remix-run/react";
import { css } from "@style/css";
import { Container, UIProvider } from "@yamada-ui/react";
import type { PropsWithChildren } from "react";

import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

import "./index.css";

export function HydrateFallback() {
  return (
    <>
      <p className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.600" })}>Loading...</p>
      <Scripts />
    </>
  );
}

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UIProvider>{children}</UIProvider>
      <Scripts />
    </>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Container as="main">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}
