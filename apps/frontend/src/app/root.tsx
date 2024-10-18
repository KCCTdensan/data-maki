import { Outlet, Scripts } from "@remix-run/react";
import { css } from "@style/css";
import { Container, UIProvider } from "@yamada-ui/react";
import type { PropsWithChildren } from "react";

import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

import radixBlue from "@radix-ui/colors/blue.css?url";
import radixGreen from "@radix-ui/colors/green.css?url";
import radixMauve from "@radix-ui/colors/mauve.css?url";
import radixOrange from "@radix-ui/colors/orange.css?url";
import radixRed from "@radix-ui/colors/red.css?url";
import radixYellow from "@radix-ui/colors/yellow.css?url";
import interVariableStyle from "inter-ui/inter-variable.css?url";
import interStyle from "inter-ui/inter.css?url";
import globalStyle from "./index.css?url";

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
      <link rel="stylesheet" href={interStyle} />
      <link rel="stylesheet" href={interVariableStyle} />
      {[radixMauve, radixRed, radixBlue, radixGreen, radixYellow, radixOrange].map((style) => (
        <link key={style} rel="stylesheet" href={style} />
      ))}
      <link rel="stylesheet" href={globalStyle} />
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
