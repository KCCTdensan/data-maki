import { type LinksFunction, type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "@remix-run/react";
import {
  ColorModeScript,
  Container,
  ThemeSchemeScript,
  UIProvider,
  createColorModeManager,
  createThemeSchemeManager,
  defaultConfig,
} from "@yamada-ui/react";
import type { ReactNode } from "react";
import { RootProvider, RootValue } from "remix-provider";

import "./index.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

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
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/red.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/yellow.css",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("Cookie");

  return json({ cookies });
};

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

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
      <Header />
      <Container as="main">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}
