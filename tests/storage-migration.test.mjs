import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const importTsModule = async (path) => {
  const source = await readFile(path, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  });

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
};

test("migrates resumes from legacy storage keys into current key", async () => {
  const { getMergedStorage } = await importTsModule(
    new URL("../app/utils/storageMigration.ts", import.meta.url)
  );

  const legacyResume = {
    legacy: {
      name: "Legacy CV",
      markdown: "# legacy",
      css: "body {}",
      styles: {
        marginV: 10,
        marginH: 10,
        lineHeight: 1.5,
        paragraphSpace: 8,
        themeColor: "#000",
        fontCJK: { name: "Noto Sans CJK" },
        fontEN: { name: "Verdana" },
        fontSize: 14,
        paper: "a4"
      },
      update: "1"
    }
  };

  const { storage, migrated } = getMergedStorage({
    MARKDOWN_RESUME_data: null,
    resumemd_data: legacyResume,
    ohmycv_data: null,
    ohcv_data: null
  });

  assert.equal(migrated, true);
  assert.deepEqual(storage, legacyResume);
});

test("keeps current storage authoritative while still merging unique legacy resumes", async () => {
  const { getMergedStorage } = await importTsModule(
    new URL("../app/utils/storageMigration.ts", import.meta.url)
  );

  const currentResume = {
    shared: {
      name: "Current CV",
      markdown: "# current",
      css: "body { color: black; }",
      styles: {
        marginV: 10,
        marginH: 10,
        lineHeight: 1.5,
        paragraphSpace: 8,
        themeColor: "#111",
        fontCJK: { name: "Noto Sans CJK" },
        fontEN: { name: "Verdana" },
        fontSize: 14,
        paper: "a4"
      },
      update: "3"
    }
  };

  const legacyResume = {
    shared: {
      name: "Old CV",
      markdown: "# old",
      css: "body { color: red; }",
      styles: {
        marginV: 9,
        marginH: 9,
        lineHeight: 1.4,
        paragraphSpace: 7,
        themeColor: "#f00",
        fontCJK: { name: "Song" },
        fontEN: { name: "Arial" },
        fontSize: 13,
        paper: "a4"
      },
      update: "2"
    },
    legacyOnly: {
      name: "Legacy Only CV",
      markdown: "# legacy-only",
      css: "body { color: blue; }",
      styles: {
        marginV: 8,
        marginH: 8,
        lineHeight: 1.3,
        paragraphSpace: 6,
        themeColor: "#00f",
        fontCJK: { name: "Song" },
        fontEN: { name: "Arial" },
        fontSize: 12,
        paper: "a4"
      },
      update: "1"
    }
  };

  const { storage, migrated } = getMergedStorage({
    MARKDOWN_RESUME_data: currentResume,
    resumemd_data: legacyResume,
    ohmycv_data: null,
    ohcv_data: null
  });

  assert.equal(migrated, true);
  assert.deepEqual(storage, {
    shared: currentResume.shared,
    legacyOnly: legacyResume.legacyOnly
  });
});
