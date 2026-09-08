const { expect, test } = require("playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(".");
const mojibakePattern = /�|鐏|閻|鏃|涓€|睢|凢|朢|弢|诊扢|衢|棢|徢|屢|扢|箢/;

test("index.html opens, main menu works, required references exist", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  expect(fs.existsSync(path.join(rootDir, "REFERENCES.md"))).toBeTruthy();
  expect(fs.existsSync(path.join(rootDir, "legacy_story_source.html"))).toBeTruthy();

  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByTestId("main-menu")).toBeVisible();
  await expect(page.getByTestId("new-journey")).toBeVisible();
  await expect(page.getByTestId("continue-journey")).toBeDisabled();
  await expect(page.getByTestId("endless-mode")).toBeVisible();

  await page.getByTestId("new-journey").click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("difficulty_select");
  await page.getByTestId("continue-page").click();
  await page.locator("[data-choice-index]").nth(1).click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day1_morning");

  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId("endless-mode").click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("endless_start");

  expect(consoleErrors).toEqual([]);
});

test("runtime Chinese text does not contain mojibake markers", () => {
  const runtimeFiles = [
    "index.html",
    "src/scenes.js",
    "src/renderer.js",
    "src/utils.js",
    "dist/grey-tide-standalone.js",
  ];

  for (const file of runtimeFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), "utf8");
    expect(content, `${file} contains mojibake text`).not.toMatch(mojibakePattern);
  }
});
