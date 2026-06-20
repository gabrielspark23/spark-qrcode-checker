import { chromium } from "playwright-core";
import fs from "node:fs";

function findChromium() {
  const base = "/opt/pw-browsers";
  for (const d of fs.readdirSync(base)) {
    for (const bin of ["chrome-linux/headless_shell", "chrome-linux/chrome"]) {
      const p = `${base}/${d}/${bin}`;
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}

const event = process.argv[2];
const B = "http://localhost:3000";
const shots = [
  ["dashboard", "/"],
  ["eventos", "/events"],
  ["evento-detalhe", `/events/${event}`],
];

const browser = await chromium.launch({ executablePath: findChromium() });

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  for (const [name, path] of shots) {
    await page.goto(`${B}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `/tmp/shot-${name}-${theme}.png`, fullPage: true });
    console.log(`ok: ${name}-${theme}`);
  }
  await ctx.close();
}
await browser.close();
