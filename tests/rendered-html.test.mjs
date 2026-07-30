import assert from "node:assert/strict";
import test from "node:test";

test("renders Empório do Frango production metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();

  assert.match(
    html,
    /<title>Açougue, galeto temperado e frango assado em Santa Maria \| Empório do Frango<\/title>/i,
  );
  assert.match(html, /Estabelecimento registrado no S\.I\.M\. — nº 061/i);
  assert.match(html, /\/images\/risoto-real-v1\.webp/i);
  assert.match(html, /Espetinhos/i);
  assert.match(html, /\/images\/espetinhos-sem-texto\.webp/i);
  assert.match(html, /\/images\/coracao-temperado-cru-v1\.webp/i);
  assert.doesNotMatch(html, /Produto cru vendido por kg\./i);
  assert.match(html, /Domingos e feriados<\/dt><dd>8h30 — 13h30<\/dd>/i);
  assert.match(
    html,
    /<link(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/emporiodofrango\.com\.br\/["'])[^>]*>/i,
  );
  assert.doesNotMatch(html, /\bname=["']codex-preview["']/i);
});
