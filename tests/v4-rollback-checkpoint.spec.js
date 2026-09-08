const { expect, test } = require("playwright/test");

const screenshotDir = "test-results/screenshots";

async function openClean(page) {
  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => Boolean(window.__GREY_TIDE__));
}

async function openScene(page, sceneId, state = {}) {
  await openClean(page);
  await page.evaluate(
    ({ sceneId: targetSceneId, state: targetState }) => {
      window.__GREY_TIDE__.setStateForTest(targetState);
      window.__GREY_TIDE__.goToSceneForTest(targetSceneId);
    },
    { sceneId, state },
  );
}

async function advanceToChoices(page, maxSteps = 16) {
  for (let index = 0; index < maxSteps; index += 1) {
    if (await page.getByTestId("choices").isVisible().catch(() => false)) return;
    if (await page.getByTestId("continue-page").isVisible().catch(() => false)) {
      await page.getByTestId("continue-page").click();
    }
  }
  throw new Error("choices did not appear");
}

async function assertCleanLayout(page, { desktopSide = true } = {}) {
  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();
      if (style.display === "none" || style.visibility === "hidden" || box.width <= 0 || box.height <= 0) return null;
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    };
    const intersects = (a, b) =>
      Boolean(a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
    const bodyText = document.body.innerText;
    const story = rect("[data-testid='text-box']");
    const side = rect("[data-testid='status-panel']");
    const choices = rect("[data-testid='choices-region']");
    const sound = rect("[data-testid='sound-toggle']");
    return {
      hasNaN: bodyText.includes("NaN"),
      hasUndefined: bodyText.includes("undefined"),
      storyOverSide: intersects(story, side),
      choicesOverStory: intersects(choices, story),
      choicesOverSide: intersects(choices, side),
      soundOverChoices: intersects(sound, choices),
      sideVisible: Boolean(side),
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  expect(metrics.hasNaN).toBeFalsy();
  expect(metrics.hasUndefined).toBeFalsy();
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 2);
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.height + 2);
  expect(metrics.choicesOverStory).toBeFalsy();
  expect(metrics.soundOverChoices).toBeFalsy();
  if (desktopSide) {
    expect(metrics.sideVisible).toBeTruthy();
    expect(metrics.storyOverSide).toBeFalsy();
    expect(metrics.choicesOverSide).toBeFalsy();
  } else {
    expect(metrics.sideVisible).toBeFalsy();
  }
}

test("rollback checkpoint keeps core UI and gameplay stable", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await openClean(page);
  await expect(page.getByTestId("main-menu")).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/rollback-main-menu.png` });

  await page.getByTestId("new-journey").click();
  await advanceToChoices(page);
  await expect(page.locator("[data-choice-index]")).toHaveCount(3);
  await page.screenshot({ path: `${screenshotDir}/rollback-difficulty-select.png` });
  await page.locator("[data-choice-index]").nth(1).click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day1_morning");
  await page.getByTestId("continue-page").click();
  await page.screenshot({ path: `${screenshotDir}/rollback-road-screen.png` });

  await openScene(page, "day1_night", { difficulty: "normal", food: 8, water: 6, medicine: 2 });
  await advanceToChoices(page);
  await page.locator("[data-choice-index]").nth(0).click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().flags.child_found_emergency_pack)).toBe(true);

  await openScene(page, "day2_mechanic", { difficulty: "normal", fuel: 5, parts: 3, medicine: 2 });
  await advanceToChoices(page);
  await page.screenshot({ path: `${screenshotDir}/rollback-character-screen.png` });
  await page.locator("[data-choice-index]").nth(1).click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().flags.mechanic_checked_fuel_line)).toBe(true);
  await assertCleanLayout(page, { desktopSide: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await openScene(page, "day2_mechanic", {
    saved_child: true,
    saved_mechanic: true,
    saved_doctor: true,
    saved_broadcaster: true,
  });
  await advanceToChoices(page);
  await assertCleanLayout(page, { desktopSide: false });
  await page.screenshot({ path: `${screenshotDir}/rollback-mobile.png` });

  expect(consoleErrors).toEqual([]);
});
