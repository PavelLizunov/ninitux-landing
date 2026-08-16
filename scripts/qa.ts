/**
 * End-to-end QA against https://ninitux.com using puppeteer-core connected
 * to the headless-chrome container on 192.168.0.142:9222.
 *
 * Run: bun run scripts/qa.ts
 */
import puppeteer, { type Browser, type Page } from "puppeteer-core";
import { promises as fs } from "node:fs";
import path from "node:path";

const TARGET = process.env.NINITUX_URL ?? "https://ninitux.com";
const CDP_URL = process.env.CDP_URL ?? "http://192.168.0.142:9222";
const OUT_DIR = "/tmp/ninitux-qa";

const results: Array<{ name: string; ok: boolean; note?: string }> = [];
let browser: Browser;

function ok(name: string, note?: string) {
  results.push({ name, ok: true, note });
  console.log(`✓ ${name}${note ? ` — ${note}` : ""}`);
}
function fail(name: string, note: string) {
  results.push({ name, ok: false, note });
  console.log(`✗ ${name} — ${note}`);
}

async function connect() {
  const versionRes = await fetch(`${CDP_URL}/json/version`);
  const version = (await versionRes.json()) as { webSocketDebuggerUrl: string };
  browser = await puppeteer.connect({
    browserWSEndpoint: version.webSocketDebuggerUrl,
    defaultViewport: null,
  });
  console.log(`connected to chromium @ ${CDP_URL}`);
}

async function newPage(width = 1400, height = 900): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setCacheEnabled(false);
  return page;
}

async function shot(page: Page, name: string) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`) as `${string}.png`,
    fullPage: false,
  });
}

async function withConsoleCapture<T>(
  page: Page,
  fn: () => Promise<T>,
): Promise<{ result: T; errors: string[] }> {
  const errors: string[] = [];
  // Expected HTTP failures from optional/unauthenticated requests:
  // - /auth/check returns 401 when no session (services component swallows in .catch)
  // - api.github.com may rate-limit with 403 (Hero/Install/Support fallback gracefully)
  const EXPECTED = [
    /status of 401/, /status of 403/, /\/auth\/check.*401/,
    /api\.github\.com.*403/, /api\.github\.com.*429/,
  ];
  const isExpected = (msg: string) => EXPECTED.some((re) => re.test(msg));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !isExpected(msg.text())) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    if (!isExpected(err.message)) errors.push(err.message);
  });
  const result = await fn();
  return { result, errors };
}

async function run() {
  await connect();

  // Test 1: page loads, no console errors
  const page = await newPage();
  const { errors } = await withConsoleCapture(page, async () => {
    const res = await page.goto(TARGET, {
      waitUntil: "networkidle2",
      timeout: 30_000,
    });
    if (!res || res.status() !== 200) {
      fail("home page loads (200)", `got ${res?.status()}`);
    } else {
      ok("home page loads (200)");
    }
  });
  await shot(page, "01-home");

  // Test 2: hero penguin sticker visible
  const heroPen = await page.$(".hero-pen");
  if (heroPen) ok("hero penguin sticker rendered");
  else fail("hero penguin sticker rendered", ".hero-pen not found");

  // Test 3: brand sticker
  const brand = await page.$(".topbar .brand");
  if (brand) ok("topbar brand sticker present");
  else fail("topbar brand sticker present", ".topbar .brand not found");

  // Test 4: marquee
  const marquee = await page.$(".marquee .track");
  if (marquee) ok("marquee track present");
  else fail("marquee track present", ".marquee .track not found");

  // Test 5: OS detection (browser will be linux usually for headless chrome)
  const detected = await page.$$(".os-card.detected");
  if (detected.length === 1) ok("exactly one OS detected", `${detected.length} card(s)`);
  else fail("exactly one OS detected", `got ${detected.length}`);

  const androidHref = await page.$eval(
    '.os-card[data-os="android"] .apk-btn',
    (el) => (el as HTMLAnchorElement).href,
  );
  if (/VPNRouter-v[^/]+-android-arm64\.apk$/.test(androidHref))
    ok("Android download points to the published ARM64 APK");
  else fail("Android download points to the published ARM64 APK", androidHref);

  // Test 6: copy button increments after click
  const copyClicked = await page.evaluate(() => {
    const btn = document.querySelector<HTMLButtonElement>(
      '.os-card[data-os="linux"] .cmd-box .copy',
    );
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (copyClicked) {
    await new Promise((r) => setTimeout(r, 200));
    const okClass = await page.evaluate(
      () =>
        !!document.querySelector('.os-card[data-os="linux"] .cmd-box .copy.ok'),
    );
    if (okClass) ok("copy button shows .ok state");
    else fail("copy button shows .ok state", "no .ok class after click");
  } else {
    fail("copy button clickable", "button missing");
  }

  // Test 7: lang toggle (EN → RU)
  const ruTextBefore = await page.evaluate(
    () =>
      window
        .getComputedStyle(
          document.querySelector('.eyebrow span[data-i18n="ru"]')!,
        )
        .display,
  );
  await page.click('.topbar .seg button[data-lang="ru"]');
  await new Promise((r) => setTimeout(r, 200));
  const ruTextAfter = await page.evaluate(
    () =>
      window
        .getComputedStyle(
          document.querySelector('.eyebrow span[data-i18n="ru"]')!,
        )
        .display,
  );
  if (ruTextBefore === "none" && ruTextAfter !== "none")
    ok("lang toggle switches RU visible", `${ruTextBefore} → ${ruTextAfter}`);
  else fail("lang toggle switches RU visible", `${ruTextBefore} → ${ruTextAfter}`);
  // Switch back to EN for further tests
  await page.click('.topbar .seg button[data-lang="en"]');
  await new Promise((r) => setTimeout(r, 100));

  // Test 8: sticky topbar gets .scrolled after scroll
  await page.evaluate(() => window.scrollTo({ top: 600 }));
  await new Promise((r) => setTimeout(r, 200));
  const scrolledClass = await page.evaluate(
    () => document.querySelector(".topbar")?.className,
  );
  if (scrolledClass?.includes("scrolled"))
    ok("topbar gets .scrolled class on scroll");
  else fail("topbar gets .scrolled class on scroll", `class="${scrolledClass}"`);
  await page.evaluate(() => window.scrollTo({ top: 0 }));

  // Test 9: features filter chip works
  await page.click('button[data-fil="routing"]');
  await new Promise((r) => setTimeout(r, 200));
  const protocolHidden = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.feat-2[data-cat="protocol"]');
    return el ? el.hidden : null;
  });
  if (protocolHidden === true) ok("features filter chip hides others");
  else fail("features filter chip hides others", `hidden=${protocolHidden}`);
  // Restore "all"
  await page.click('button[data-fil="all"]');

  // Test 10: lightbox opens on screenshot tile click, closes on Esc
  await page.click(".shot.wide");
  await new Promise((r) => setTimeout(r, 300));
  const lbOpen = await page.$(".lightbox.open");
  if (lbOpen) ok("lightbox opens on tile click");
  else fail("lightbox opens on tile click", ".lightbox.open not found");
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 200));
  const lbClosed = await page.$(".lightbox.open");
  if (!lbClosed) ok("lightbox closes on Escape");
  else fail("lightbox closes on Escape", "still open");

  // Test 11: services admin rows are locked (no /auth/check session)
  const lockedRows = await page.$$(".svc-card.locked");
  if (lockedRows.length >= 4)
    ok("admin services locked (no auth)", `${lockedRows.length} locked`);
  else fail("admin services locked", `only ${lockedRows.length} locked`);

  // Test 12: mobile drawer at 360px
  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 200));
  await page.click("#mobile-open");
  await new Promise((r) => setTimeout(r, 200));
  const drawerOpen = await page.$(".mobile-drawer.open");
  if (drawerOpen) ok("mobile drawer opens on ≡");
  else fail("mobile drawer opens on ≡", "drawer not found");
  await shot(page, "12-mobile");

  // Console errors
  if (errors.length === 0) ok("no console errors");
  else fail("no console errors", `${errors.length}: ${errors.slice(0, 3).join(" | ")}`);

  // Summary
  await fs.mkdir(OUT_DIR, { recursive: true });
  const summary = {
    target: TARGET,
    timestamp: new Date().toISOString(),
    passed: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
  await fs.writeFile(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2),
  );

  console.log(`\n────────────────────`);
  console.log(`✓ passed: ${summary.passed}`);
  console.log(`✗ failed: ${summary.failed}`);
  console.log(`report: ${OUT_DIR}/summary.json`);

  await browser.disconnect();
  process.exit(summary.failed === 0 ? 0 : 1);
}

run().catch((e) => {
  console.error(e);
  process.exit(2);
});
