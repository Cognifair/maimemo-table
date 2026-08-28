#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

function fail(message) {
  console.error(`Maimemo Table: ${message}`);
  process.exit(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("\n", "<br>");
}

function findBrowser() {
  const candidates = [
    process.env.MAIMEMO_TABLE_BROWSER,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const [, , inputArg, pngArg, htmlArg] = process.argv;
if (!inputArg || !pngArg) {
  fail("usage: node render_table.cjs <input.json> <output.png> [output.html]");
}

const inputPath = path.resolve(inputArg);
const pngPath = path.resolve(pngArg);
const htmlPath = path.resolve(
  htmlArg || path.join(path.dirname(pngPath), `${path.basename(pngPath, path.extname(pngPath))}.html`),
);

let data;
try {
  data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  fail(`cannot read valid UTF-8 JSON from ${inputPath}: ${error.message}`);
}

if (typeof data.title !== "string" || !data.title.trim()) fail("title must be a non-empty string");
if (!Array.isArray(data.headers) || data.headers.length < 2) fail("headers must contain at least two columns");
if (!Array.isArray(data.rows) || data.rows.length === 0) fail("rows must be a non-empty array");
for (const [index, row] of data.rows.entries()) {
  if (!Array.isArray(row) || row.length !== data.headers.length) {
    fail(`row ${index + 1} must contain exactly ${data.headers.length} cells`);
  }
}

const defaults = {
  accent: "#36b59d",
  light: "#e6f3f0",
  deep: "#247465",
  white: "#ffffff",
};
const theme = { ...defaults, ...(data.theme || {}) };
for (const [key, value] of Object.entries(theme)) {
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) fail(`theme.${key} must be a six-digit hex color`);
}

const width = Number.isInteger(data.width) && data.width >= 800 ? data.width : 2000;
const cornerStyle = data.cornerStyle || "square";
if (!new Set(["square", "rounded"]).has(cornerStyle)) {
  fail('cornerStyle must be either "square" or "rounded"');
}
const fontFamily = data.fontFamily || '"Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const cssPath = path.join(__dirname, "..", "assets", "table-theme.css");
const css = fs.readFileSync(cssPath, "utf8");
const otherWidth = (87 / (data.headers.length - 1)).toFixed(6);
const columns = ["<col>", ...data.headers.slice(1).map(() => `<col style="width:${otherWidth}%">`)].join("");
const headerHtml = data.headers.map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`).join("");
const bodyHtml = data.rows
  .map((row) => {
    const [label, ...cells] = row;
    return `<tr><th scope="row">${escapeHtml(label)}</th>${cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(data.title)}</title>
<style>
:root {
  --mt-accent: ${theme.accent};
  --mt-light: ${theme.light};
  --mt-deep: ${theme.deep};
  --mt-white: ${theme.white};
  --mt-font: ${fontFamily};
}
${css}
</style>
</head>
<body>
<main id="maimemo-table" data-corner-style="${cornerStyle}">
  <h1>${escapeHtml(data.title)}</h1>
  <table aria-label="${escapeHtml(data.title)}">
    <colgroup>${columns}</colgroup>
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${bodyHtml}</tbody>
  </table>
</main>
</body>
</html>
`;

fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.mkdirSync(path.dirname(pngPath), { recursive: true });
fs.writeFileSync(htmlPath, html, "utf8");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  fail("the playwright package is unavailable; locate workspace dependencies and set NODE_PATH to their Node packages directory");
}

const executablePath = findBrowser();
if (!executablePath) {
  fail("no supported local Chrome, Edge, or Chromium executable was found; set MAIMEMO_TABLE_BROWSER to its absolute path");
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    const page = await browser.newPage({ viewport: { width, height: 1400 }, deviceScaleFactor: 1 });
    await page.goto(`file:///${htmlPath.replaceAll("\\", "/")}`);
    await page.locator("#maimemo-table").screenshot({ path: pngPath, omitBackground: true });
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({ png: pngPath, html: htmlPath, width, cornerStyle, platform: os.platform() }));
})().catch((error) => fail(error.message));
