// Renders every template (Portuguese sample props) and screenshots it to previews/<id>.png.
//
//   pnpm previews        (builds dist first, then runs this file)
//
// Uses a local Chrome/Chromium/Edge through its command line only (no Playwright, no Puppeteer):
//   1. --dump-dom on a copy of the email with a tiny script that writes the page height into the DOM;
//   2. --screenshot with --window-size=680,<height> so each PNG fits its content.
// Set CHROME_PATH to pick a browser. Temporary files go to .previews-tmp/ (git ignored).

import { spawn, spawnSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { render } from "@react-email/render";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist", "index.js");
if (!existsSync(dist)) {
  console.error("dist/ not found. Run `pnpm build` first (or `pnpm previews`, which builds).");
  process.exit(1);
}
const { templates } = await import(pathToFileURL(dist).href);

const WIDTH = 680;
const CONCURRENCY = 4;
const tmp = join(root, ".previews-tmp");
const out = join(root, "previews");
mkdirSync(tmp, { recursive: true });
mkdirSync(out, { recursive: true });
// Leftovers of an interrupted run.
for (const name of readdirSync(tmp)) {
  if (name.startsWith("profile-")) {
    try {
      rmSync(join(tmp, name), { recursive: true, force: true });
    } catch {
      // Still locked: ignore.
    }
  }
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe") : undefined,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const r = spawnSync(name, ["--version"], { encoding: "utf8" });
    if (r.status === 0) return name;
  }
  return null;
}

const chrome = findChrome();
if (!chrome) {
  console.error("No Chrome, Chromium or Edge found. Set CHROME_PATH to the browser executable.");
  process.exit(1);
}

// Light mode for the screenshots, no background work, and a fresh profile per launch so a
// browser that is already open is never reused or touched.
const baseArgs = [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--blink-settings=preferredColorScheme=1",
  "--disable-background-networking",
  "--disable-component-update",
  "--disable-sync",
  "--disable-default-apps",
  "--no-service-autorun",
  "--password-store=basic",
  "--disable-features=Translate,MediaRouter,OptimizationHints",
];

let launches = 0;

/** One browser run. Resolves with what it printed, or null when it did not finish in time. */
function launch(args) {
  const id = `${process.pid}-${launches++}`;
  const profile = join(tmp, `profile-${id}`);
  // Output goes to a file, not a pipe: on Windows the browser's helper processes inherit a pipe
  // and keep it open after the main process exits.
  const outFile = join(tmp, `stdout-${id}.txt`);
  const fd = openSync(outFile, "w");
  return new Promise((done) => {
    const child = spawn(chrome, [...baseArgs, `--user-data-dir=${profile}`, ...args], { stdio: ["ignore", fd, "ignore"], windowsHide: true });
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) child.kill("SIGKILL");
    }, 45_000);
    const finish = (ok) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      closeSync(fd);
      const stdout = readFileSync(outFile, "utf8");
      rmSync(outFile, { force: true });
      try {
        rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
      } catch {
        // A profile still locked by a closing browser is removed on the next run.
      }
      done(ok ? stdout : null);
    };
    child.on("exit", (code, signal) => finish(signal !== "SIGKILL"));
    child.on("error", () => finish(false));
  });
}

/** Runs the browser, retrying a run that hangs (up to 3 tries). */
async function runChrome(args, label) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const stdout = await launch(args);
    if (stdout !== null) return stdout;
    console.warn(`  ${label}: browser did not answer, retrying`);
  }
  throw new Error(`${label}: browser did not answer after 3 tries`);
}

/**
 * Stand-in QR for the Pix preview only: a QR-like pattern drawn locally (it does not encode the
 * payment). Real emails get the QR image URL from your payment provider.
 */
function sampleQr(seedText) {
  const n = 29;
  let seed = [...seedText].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  const on = Array.from({ length: n }, () => Array.from({ length: n }, () => rand() > 0.5));
  const finder = (x0, y0) => {
    for (let y = -1; y <= 7; y++)
      for (let x = -1; x <= 7; x++) {
        const xx = x0 + x;
        const yy = y0 + y;
        if (xx < 0 || yy < 0 || xx >= n || yy >= n) continue;
        const ring = Math.max(Math.abs(x - 3), Math.abs(y - 3));
        on[yy][xx] = ring !== 2 && ring !== 4;
      }
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  for (let i = 8; i < n - 8; i++) on[6][i] = on[i][6] = i % 2 === 0;
  let rects = "";
  on.forEach((row, y) => row.forEach((v, x) => (rects += v ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : "")));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><g fill="#0E1116">${rects}</g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Measured in a short window, so the result is the content height and not the window height.
const measureScript =
  "<script>window.addEventListener('load',function(){var b=document.querySelector('body > table')||document.body;" +
  "var h=Math.ceil(Math.max(document.body.scrollHeight,b.getBoundingClientRect().bottom+window.scrollY));" +
  "var d=document.createElement('div');d.id='preview-height';d.textContent=String(h);document.body.appendChild(d);});</script>";

async function preview(t) {
  const props = { ...t.previewProps, lang: "pt" };
  if (t.id === "pix-charge") props.qrCodeUrl = sampleQr(props.pixCode);
  const html = await render(createElement(t.component, props));
  const page = join(tmp, `${t.id}.html`);
  const measure = join(tmp, `${t.id}.measure.html`);
  writeFileSync(page, html);
  writeFileSync(measure, html.replace(/<\/body>/i, `${measureScript}</body>`));

  const dom = await runChrome([`--window-size=${WIDTH},300`, "--virtual-time-budget=3000", "--dump-dom", pathToFileURL(measure).href], t.id);
  const match = /id="preview-height">(\d+)</.exec(dom);
  const height = match ? Math.min(4000, Math.max(200, Number(match[1]))) : 1400;
  if (!match) console.warn(`  ${t.id}: could not read the height, using ${height}px`);

  const png = join(out, `${t.id}.png`);
  rmSync(png, { force: true });
  await runChrome([`--window-size=${WIDTH},${height}`, "--default-background-color=F4F4F2FF", `--screenshot=${png}`, pathToFileURL(page).href], t.id);
  if (!existsSync(png)) throw new Error(`${t.id}: screenshot failed`);
  console.log(`  ${t.id}.png  ${WIDTH}x${height}  ${(statSync(png).size / 1024).toFixed(0)} KB`);
}

const queue = [...templates];
const errors = [];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let t = queue.shift(); t; t = queue.shift()) {
      try {
        await preview(t);
      } catch (e) {
        errors.push(e);
        console.error(`  ${e.message}`);
      }
    }
  }),
);

if (errors.length) process.exit(1);
console.log(`Done: ${templates.length} previews in previews/ (browser: ${chrome}).`);
