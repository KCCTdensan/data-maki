/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream, renderToString } from "react-dom/server";

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Data Maki UI</title>
</head>
<body>
  <div id="app"><!-- Remix SPA --></body>
</html>
`.trim();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  const appHtml = renderToString(<RemixServer context={remixContext} url={request.url} />);

  const html = indexHtml.replace("<!-- Remix SPA -->", appHtml);

  responseHeaders.set("Content-Type", "text/html");

  return new Response(html, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
