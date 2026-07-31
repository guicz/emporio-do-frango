import assert from "node:assert/strict";
import { access } from "node:fs/promises";
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
  assert.match(html, /A noite pede espetinho na brasa\./i);
  assert.match(html, /Pedir espetinhos/i);
  await Promise.all(
    [
      "espetinho-carne-v1.webp",
      "espetinho-coracao-v1.webp",
      "espetinho-queijo-coalho-v1.webp",
      "espetinho-pao-de-alho-v1.webp",
    ].map((fileName) =>
      access(new URL(`../public/images/${fileName}`, import.meta.url)),
    ),
  );
  assert.match(html, /\/images\/coracao-temperado-cru-v1\.webp/i);
  assert.match(html, /\/images\/real-balcao-aves\.png/i);
  assert.match(html, /\/images\/real-frangos-assados\.png/i);
  assert.match(html, /\/images\/real-maionese-400g\.png/i);
  assert.match(html, /\/images\/real-conveniencia-loja\.png/i);
  assert.match(html, /\/images\/maionese-polenta-v7\.webp/i);
  assert.match(html, /\/images\/frango-assado-producao-v1-poster\.webp/i);
  assert.match(html, /Frango assado: da máquina à embalagem/i);
  assert.match(html, /\/videos\/coracao-temperado-maquina\.mp4/i);
  assert.match(html, /\/images\/coracao-temperado-maquina-poster\.jpg/i);
  assert.match(html, /Alternar entre modo claro e escuro/i);
  assert.match(html, /emporio_theme/i);
  await Promise.all(
    [
      "../public/videos/frango-assado-producao-v1.mp4",
      "../public/images/frango-assado-producao-v1-poster.webp",
    ].map((assetPath) => access(new URL(assetPath, import.meta.url))),
  );
  assert.doesNotMatch(html, /Produto cru vendido por kg\./i);
  assert.match(html, /Domingos e feriados<\/dt><dd>8h30 — 13h30<\/dd>/i);
  assert.match(
    html,
    /<link(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/emporiodofrango\.com\.br\/["'])[^>]*>/i,
  );
  assert.match(
    html,
    /<meta(?=[^>]*\bproperty=["']og:image["'])(?=[^>]*\bcontent=["']https:\/\/emporiodofrango\.com\.br\/og-v2\.png["'])[^>]*>/i,
  );
  assert.match(html, /<meta[^>]+property=["']og:image:width["'][^>]+content=["']1200["']/i);
  assert.match(html, /<meta[^>]+property=["']og:image:height["'][^>]+content=["']630["']/i);
  await access(new URL("../public/og-v2.png", import.meta.url));
  assert.doesNotMatch(html, /\bname=["']codex-preview["']/i);
});
