import { type LinksFunction, json } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import {
  ColorModeScript,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
  ThemeSchemeScript,
  UIProvider,
  createColorModeManager,
  createThemeSchemeManager,
  defaultConfig,
} from "@yamada-ui/react";
import type { ReactNode } from "react";
import { RootProvider, RootValue } from "remix-provider";

import "./index.css";

export const links: LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://rsms.me/",
  },
  {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/mauve.css",
  },
];

export const loader = async ({ request }) => {
  const cookies = request.headers.get("Cookie");

  return json({ cookies });
};

export function Layout({ children }: { children: ReactNode }) {
  const data = useLoaderData<typeof loader>();

  const colorModeManager = createColorModeManager("ssr", data?.cookies);
  const themeSchemeManager = createThemeSchemeManager("ssr", data?.cookies);

  return (
    <RootProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <RootValue />
        </head>
        <body>
          <ColorModeScript type="cookie" initialColorMode={defaultConfig.initialColorMode} />
          <ThemeSchemeScript type="cookie" initialThemeScheme={defaultConfig.initialThemeScheme} />

          <UIProvider colorModeManager={colorModeManager} themeSchemeManager={themeSchemeManager}>
            {children}
          </UIProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </RootProvider>
  );
}

export default function App() {
  return (
    <>
      <Container as="header" bg="var(--mauve-4)">
        <Flex align="center">
          <Heading fontWeight="semilight">Data Maki UI</Heading>
          <Spacer />
          <Text>Procon 2024</Text>
        </Flex>
      </Container>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
