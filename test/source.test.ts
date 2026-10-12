import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { templates } from "../src/index.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = join(root, "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// The package is provider neutral and public: nothing internal, no keys, no environment reads.
const FORBIDDEN = ["couryo.com", "ck_live_", "ck_test_", "whsec_", "api.couryo", "@couryo/contract", "process.env", String.fromCharCode(0x2014)];

describe("source", () => {
  const files = walk(src);

  it.each(FORBIDDEN)("src/ never contains %j", (needle) => {
    const hits = files.filter((f) => readFileSync(f, "utf8").includes(needle)).map((f) => relative(root, f));
    expect(hits).toEqual([]);
  });

  it("never imports a workspace package", () => {
    const hits = files.filter((f) => /from\s+["']@couryo\//.test(readFileSync(f, "utf8"))).map((f) => relative(root, f));
    expect(hits).toEqual([]);
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as Record<string, Record<string, string> | undefined>;
    const deps = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies };
    expect(Object.keys(deps).filter((d) => d.startsWith("@couryo/"))).toEqual([]);
  });

  it("has one file per template, named after its id, with a default export and PreviewProps", () => {
    const names = readdirSync(join(src, "templates")).map((f) => f.replace(/\.tsx$/, "")).sort();
    expect(names).toEqual(templates.map((t) => t.id).sort());
    for (const id of names) {
      const code = readFileSync(join(src, "templates", `${id}.tsx`), "utf8");
      expect(code, id).toMatch(/export default \w+;/);
      expect(code, id).toMatch(/\.PreviewProps = \{/);
    }
  });

  it("ships a preview image for every template", () => {
    const previews = readdirSync(join(root, "previews")).filter((f) => f.endsWith(".png"));
    for (const t of templates) expect(previews, t.id).toContain(`${t.id}.png`);
  });
});
