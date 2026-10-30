import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const importTsModule = async (path) => {
  const source = await readFile(path, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
};

test("handles a reset URL import without rejecting to the caller", async () => {
  const { importFileFromUrl } = await importTsModule(
    new URL("../app/utils/urlImport.ts", import.meta.url)
  );
  const error = Object.assign(new Error("read ECONNRESET"), { code: "ECONNRESET" });

  const result = await importFileFromUrl("https://example.test/resume.md", async () => {
    throw error;
  });

  assert.deepEqual(result, { ok: false, error });
});

test("returns imported URL content on success", async () => {
  const { importFileFromUrl } = await importTsModule(
    new URL("../app/utils/urlImport.ts", import.meta.url)
  );

  const result = await importFileFromUrl(
    "https://example.test/resume.md",
    async () => "# Resume"
  );

  assert.deepEqual(result, { ok: true, content: "# Resume" });
});
