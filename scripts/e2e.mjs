#!/usr/bin/env node
/**
 * End-to-end check of the built site in a real browser, with screenshots.
 *
 *   bun run build && bun run start &     # the site on http://127.0.0.1:3000
 *   bun run e2e
 *
 * Environment:
 *   SITE_URL          where the site runs (default http://127.0.0.1:3000)
 *   CHROME_PATH       Chrome or Chromium binary (default /usr/bin/google-chrome)
 *   E2E_OUT           folder for screenshots (default e2e-out)
 *   E2E_CHECK_LINKS   "0" skips the requests that verify the download links on github.com
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const BASE = (process.env.SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
const OUT = process.env.E2E_OUT ?? "e2e-out";
const CHECK_LINKS = process.env.E2E_CHECK_LINKS !== "0";

const UA = {
  win: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
};

const failures = [];
let passed = 0;

async function check(name, run) {
  try {
    await run();
    passed += 1;
    console.log(`ok    ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`FAIL  ${name}\n      ${String(error?.message ?? error).split("\n")[0]}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--lang=en-US"],
});

/** Opens the site. `languages` overrides what the browser reports as preferred languages. */
async function open({ query = "", ua = UA.win, width = 1280, height = 900, languages, mobile = false } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setUserAgent(ua);
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  if (languages) {
    await page.evaluateOnNewDocument((list) => {
      Object.defineProperty(navigator, "languages", { get: () => list });
      Object.defineProperty(navigator, "language", { get: () => list[0] });
    }, languages);
  }
  // The analytics script lives on another host and is not part of this check: it gets an empty answer.
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.url().includes("analytics.ninitux.com")) {
      request.respond({ status: 200, contentType: "application/javascript", body: "" });
    } else {
      request.continue();
    }
  });
  const response = await page.goto(`${BASE}/${query}`, { waitUntil: "networkidle0", timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  return { page, errors, status: response?.status() ?? 0 };
}

const visible = (page, selector) =>
  page.evaluate((sel) => {
    const node = document.querySelector(sel);
    if (!node) return false;
    const box = node.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && getComputedStyle(node).visibility !== "hidden";
  }, selector);

const overflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

const activeFrame = (page, scope) =>
  page.evaluate((sel) => {
    const lang = document.documentElement.getAttribute("data-lang");
    return document.querySelector(`${sel} .st-layer[data-i18n="${lang}"] .st-img.is-active`)?.getAttribute("src") ?? "";
  }, scope);

async function shot(page, name, selector) {
  const path = `${OUT}/${name}.png`;
  if (selector) await (await page.$(selector)).screenshot({ path });
  else await page.screenshot({ path, fullPage: true });
}

await mkdir(OUT, { recursive: true });

// ── Page, language, system ────────────────────────────────────────────────
await check("the page loads without script errors", async () => {
  const { page, errors, status } = await open({ query: "?lang=ru" });
  expect(status === 200, `status ${status}`);
  expect(errors.length === 0, `console errors: ${errors.join(" | ")}`);
  expect((await page.$$("h1")).length === 1, "exactly one h1 expected");
  await page.close();
});

await check("Russian browser gets Russian, English browser gets English", async () => {
  const ru = await open({ languages: ["ru-RU", "ru", "en"] });
  expect((await ru.page.evaluate(() => document.documentElement.lang)) === "ru", "ru browser is not ru");
  await ru.page.close();
  const en = await open({ languages: ["en-US", "en"] });
  expect((await en.page.evaluate(() => document.documentElement.lang)) === "en", "en browser is not en");
  expect(await visible(en.page, 'h1 [data-i18n="en"]'), "English headline is hidden");
  expect(!(await visible(en.page, 'h1 [data-i18n="ru"]')), "Russian headline is visible in English");
  await en.page.close();
});

await check("the language switch works and is remembered", async () => {
  const { page } = await open({ languages: ["ru-RU", "ru"] });
  await page.click('.seg button:nth-child(2)');
  expect((await page.evaluate(() => document.documentElement.getAttribute("data-lang"))) === "en", "did not switch");
  expect((await page.$eval('.seg button:nth-child(2)', (b) => b.getAttribute("aria-pressed"))) === "true", "aria-pressed");
  await page.reload({ waitUntil: "networkidle0" });
  expect((await page.evaluate(() => document.documentElement.getAttribute("data-lang"))) === "en", "not remembered");
  await page.evaluate(() => localStorage.clear());
  await page.close();
});

const HERO_FILE = { win: /VPNRouter-Setup-v[\d.]+(-r\d+)?\.exe$/, mac: /-mac\.dmg$/, android: /-android-arm64\.apk$/ };
for (const os of ["win", "mac", "linux", "android", "ios"]) {
  await check(`first screen for ${os}: the right download button`, async () => {
    const { page } = await open({ query: "?lang=ru", ua: UA[os], mobile: os === "android" || os === "ios", width: os === "android" || os === "ios" ? 390 : 1280 });
    expect((await page.evaluate(() => document.documentElement.getAttribute("data-os"))) === os, "data-os mismatch");
    for (const other of ["win", "mac", "linux", "android", "ios"]) {
      const shown = await visible(page, `.cta [data-show-os="${other}"]`);
      expect(shown === (other === os), `block ${other} visible=${shown}`);
    }
    const href = await page.$eval(`.cta [data-show-os="${os}"] a.btn`, (a) => a.getAttribute("href"));
    if (HERO_FILE[os]) expect(HERO_FILE[os].test(href), `unexpected link ${href}`);
    else expect(href === "#download", `unexpected link ${href}`);
    const panel = os === "ios" ? "win" : os;
    expect(await visible(page, `#os-panel-${panel}`), `panel ${panel} is not open`);
    await page.close();
  });
}

// ── Download section ──────────────────────────────────────────────────────
await check("system tabs switch the install steps", async () => {
  const { page } = await open({ query: "?lang=ru" });
  for (const os of ["mac", "linux", "android", "win"]) {
    await page.click(`[data-os-tab="${os}"]`);
    expect(await visible(page, `#os-panel-${os}`), `${os} panel hidden after click`);
    expect((await page.$$eval(".os-panel", (list) => list.filter((n) => n.getBoundingClientRect().height > 0).length)) === 1, "more than one panel");
    expect((await page.$eval(`[data-os-tab="${os}"]`, (b) => b.getAttribute("aria-selected"))) === "true", "aria-selected");
    await shot(page, `download-${os}`, "#download");
  }
  await page.close();
});

await check("the copy button answers", async () => {
  const { page } = await open({ query: "?lang=ru&os=linux" });
  await browser.defaultBrowserContext().overridePermissions(BASE, ["clipboard-read", "clipboard-write"]);
  await page.click("#os-panel-linux .cmd-copy");
  await page.waitForSelector("#os-panel-linux .cmd-copy.is-ok", { timeout: 3000 });
  await page.close();
});

await check("every download link points to a published file", async () => {
  const { page } = await open({ query: "?lang=ru" });
  const links = await page.$$eval('a[href*="/releases/download/"]', (list) => [...new Set(list.map((a) => a.href))]);
  expect(links.length === 8, `expected 8 distinct files, found ${links.length}`);
  const tags = new Set(links.map((url) => url.split("/releases/download/")[1].split("/")[0]));
  expect(tags.size === 1, `links mix versions: ${[...tags].join(", ")}`);
  if (CHECK_LINKS) {
    for (const url of links) {
      const response = await fetch(url, { method: "HEAD", redirect: "manual" });
      expect(response.status === 302 || response.status === 200, `${response.status} for ${url}`);
    }
  }
  await page.close();
});

// ── Guides ────────────────────────────────────────────────────────────────
await check("the demo on the first screen plays by itself", async () => {
  const { page } = await open({ query: "?lang=ru" });
  const first = await activeFrame(page, ".hero-demo");
  expect(first.endsWith("first-run-paste.webp"), `starts at ${first}`);
  await page.waitForFunction(
    () => !document.querySelector('.hero-demo .st-layer[data-i18n="ru"] .st-img.is-active')?.getAttribute("src")?.endsWith("paste.webp"),
    { timeout: 9000 },
  );
  await page.close();
});

await check("guides: tabs, steps, back and forth, pause", async () => {
  const { page } = await open({ query: "?lang=ru" });
  await page.$eval("#guide", (node) => node.scrollIntoView());
  await page.click(".guide-tabs button:nth-child(2)");
  await page.waitForSelector('#guide .st[data-guide="apps"]');
  await page.click("#guide .st-steps li:nth-child(5) button");
  expect((await activeFrame(page, "#guide")).endsWith("apps-pick.webp"), "step 5 did not open");
  expect((await page.$eval("#guide .st", (n) => n.dataset.running)) === "false", "a click on a step must pause");
  await page.click("#guide .st-tap-next");
  expect((await activeFrame(page, "#guide")).endsWith("apps-add.webp"), "next did not work");
  await page.click("#guide .st-tap-prev");
  expect((await activeFrame(page, "#guide")).endsWith("apps-pick.webp"), "back did not work");
  const spot = await page.$eval('#guide .st-layer[data-i18n="ru"] .st-spot', (n) => getComputedStyle(n).opacity);
  expect(spot === "1", "the highlight is hidden on a step that has one");
  await sleep(800);
  await shot(page, "guide-apps-step4", "#guide");
  for (const [position, suffix] of [[2, "apps-menu.webp"], [3, "apps-advanced.webp"]]) {
    await page.click(`#guide .st-steps li:nth-child(${position}) button`);
    expect((await activeFrame(page, "#guide")).endsWith(suffix), `missing current menu frame ${suffix}`);
  }
  await page.click(".guide-tabs button:nth-child(3)");
  await page.waitForSelector('#guide .st[data-guide="free"]');
  await page.click("#guide .st-steps li:last-child button");
  expect((await activeFrame(page, "#guide")).endsWith("free-connect.webp"), "free result frame did not open");
  await shot(page, "guide-free-results", "#guide");
  await page.click("#guide .st-play");
  expect((await page.$eval("#guide .st-play", (b) => b.getAttribute("aria-pressed"))) === "true", "play did not resume");
  await page.close();
});

await check("the link to free servers opens that guide", async () => {
  const { page } = await open({ query: "?lang=ru" });
  await page.click('.note [data-i18n="ru"] a[data-guide-link="free"]');
  await page.waitForSelector('#guide .st[data-guide="free"]', { timeout: 3000 });
  await page.close();
});

for (const lang of ["ru", "en"]) {
  await check(`all guide frames load (${lang})`, async () => {
    const { page } = await open({ query: `?lang=${lang}` });
    await page.$eval("#guide", (node) => node.scrollIntoView());
    for (let tab = 1; tab <= 3; tab += 1) {
      await page.click(`.guide-tabs button:nth-child(${tab})`);
      await page.waitForNetworkIdle({ idleTime: 400, timeout: 15000 });
      const broken = await page.$$eval(`#guide .st-layer[data-i18n="${lang}"] .st-img`, (list) =>
        list.filter((img) => !(img.complete && img.naturalWidth > 0)).map((img) => img.getAttribute("src")),
      );
      expect(broken.length === 0, `frames not loaded: ${broken.join(", ")}`);
    }
    await page.close();
  });
}

await check("questions open", async () => {
  const { page } = await open({ query: "?lang=ru" });
  await page.click("#faq-link summary");
  expect(await visible(page, "#faq-link p"), "the answer did not open");
  await page.close();
});

// ── Layout ────────────────────────────────────────────────────────────────
for (const width of [360, 390, 768, 941, 1024, 1100, 1280, 1680]) {
  await check(`no sideways scroll at ${width}px`, async () => {
    const { page } = await open({ query: "?lang=ru", width, mobile: width < 700, ua: width < 700 ? UA.android : UA.win });
    const extra = await overflow(page);
    expect(extra <= 0, `page is ${extra}px wider than the screen`);
    for (const os of ["mac", "linux"]) {
      await page.click(`[data-os-tab="${os}"]`);
      expect((await overflow(page)) <= 0, `${os} tab overflows`);
    }
    await page.close();
  });
}

await check("the download button is on the first screen of a phone", async () => {
  const { page } = await open({ query: "?lang=ru", ua: UA.android, width: 390, height: 780, mobile: true });
  const bottom = await page.$eval('.cta [data-show-os="android"] a.btn', (a) => a.getBoundingClientRect().bottom);
  expect(bottom <= 780, `button ends at ${Math.round(bottom)}px, below a 780px screen`);
  await page.close();
});

// ── Screenshots for a human ───────────────────────────────────────────────
await check("screenshots", async () => {
  for (const [name, options] of [
    ["page-desktop-ru", { query: "?lang=ru" }],
    ["page-desktop-en", { query: "?lang=en" }],
    ["page-phone-ru", { query: "?lang=ru", ua: UA.android, width: 390, height: 800, mobile: true }],
    ["page-phone-en-iphone", { query: "?lang=en", ua: UA.ios, width: 390, height: 800, mobile: true }],
  ]) {
    const { page } = await open(options);
    await shot(page, name);
    await page.close();
  }
  const { page } = await open({ query: "?lang=ru" });
  await page.screenshot({ path: `${OUT}/first-screen-desktop-ru.png` });
  await page.close();
});

await browser.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log(failures.map((name) => `  - ${name}`).join("\n"));
  process.exit(1);
}
