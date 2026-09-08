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

async function checkSafeLayout(page, { expectDesktopSide = true } = {}) {
  const metrics = await page.evaluate(() => {
    const rect = (selector, last = false) => {
      const elements = [...document.querySelectorAll(selector)].filter((element) => {
        const style = window.getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
      });
      const element = last ? elements.at(-1) : elements[0];
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        left: box.left,
        width: box.width,
        height: box.height,
      };
    };

    const intersects = (a, b) =>
      Boolean(a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);

    const bodyText = document.body.innerText;
    const story = rect("[data-testid='text-box']");
    const side = rect("[data-testid='status-panel']");
    const choices = rect("[data-testid='choices']");
    const choicesRegion = rect("[data-testid='choices-region']");
    const title = rect("[data-testid='scene-header']");
    const hud = rect("[data-testid='hud']");
    const sound = rect("[data-testid='sound-toggle']");
    const companionLast = rect("[data-testid='status-panel'] [data-testid='companion-card']", true);
    const mobileDrawer = rect("[data-testid='mobile-status-drawer']");

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      story,
      side,
      choices,
      choicesRegion,
      title,
      hud,
      sound,
      companionLast,
      mobileDrawer,
      storyOverSide: intersects(story, side),
      storyOverCompanionLast: intersects(story, companionLast),
      choicesOverStory: intersects(choicesRegion || choices, story),
      choicesOverSide: intersects(choicesRegion || choices, side),
      soundOverChoices: intersects(sound, choicesRegion || choices),
      hudOverStory: intersects(hud, story),
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      hasNaN: bodyText.includes("NaN"),
      hasUndefined: bodyText.includes("undefined"),
    };
  });

  const insideViewport = (box) => {
    if (!box) return false;
    return (
      box.left >= -1 &&
      box.top >= -1 &&
      box.right <= metrics.viewport.width + 1 &&
      box.bottom <= metrics.viewport.height + 1
    );
  };

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport.width + 2);
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.viewport.height + 2);
  expect(metrics.hasNaN).toBeFalsy();
  expect(metrics.hasUndefined).toBeFalsy();
  expect(insideViewport(metrics.story)).toBeTruthy();
  expect(insideViewport(metrics.title)).toBeTruthy();
  expect(metrics.title.left).toBeGreaterThanOrEqual(16);
  expect(metrics.hudOverStory).toBeFalsy();

  if (metrics.choices) {
    expect(insideViewport(metrics.choices)).toBeTruthy();
    expect(metrics.choicesOverStory).toBeFalsy();
    expect(metrics.soundOverChoices).toBeFalsy();
  }

  if (expectDesktopSide) {
    expect(insideViewport(metrics.side)).toBeTruthy();
    expect(insideViewport(metrics.companionLast)).toBeTruthy();
    expect(metrics.storyOverSide).toBeFalsy();
    expect(metrics.storyOverCompanionLast).toBeFalsy();
    if (metrics.choices) expect(metrics.choicesOverSide).toBeFalsy();
  } else {
    expect(metrics.side).toBeNull();
    expect(insideViewport(metrics.mobileDrawer)).toBeTruthy();
  }
}

test("layout safe zones prevent story, side panel, and choices overlap", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const fullCrewState = {
    saved_child: true,
    saved_mechanic: true,
    saved_doctor: true,
    saved_broadcaster: true,
    broadcast_truth: 6,
    food: 8,
    water: 8,
    fuel: 6,
    parts: 6,
    vehicle: 88,
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  await openScene(page, "day5_car_lights", fullCrewState);
  await checkSafeLayout(page, { expectDesktopSide: true });
  await page.screenshot({ path: `${screenshotDir}/fix-layout-road-desktop.png` });

  await page.setViewportSize({ width: 1280, height: 720 });
  await openScene(page, "day7_final_blockade", fullCrewState);
  await advanceToChoices(page);
  await checkSafeLayout(page, { expectDesktopSide: true });
  await page.screenshot({ path: `${screenshotDir}/fix-layout-road-choices.png` });

  await openScene(page, "day5_broadcaster", fullCrewState);
  await checkSafeLayout(page, { expectDesktopSide: true });
  await page.screenshot({ path: `${screenshotDir}/fix-layout-side-panel.png` });

  await page.setViewportSize({ width: 390, height: 844 });
  await openScene(page, "day2_mechanic", {
    saved_child: true,
    saved_mechanic: true,
    saved_doctor: true,
    saved_broadcaster: true,
  });
  await advanceToChoices(page);
  await checkSafeLayout(page, { expectDesktopSide: false });
  await page.screenshot({ path: `${screenshotDir}/fix-layout-mobile.png` });

  await page.setViewportSize({ width: 844, height: 390 });
  await openScene(page, "day2_mechanic", {
    saved_child: true,
    saved_mechanic: true,
    saved_doctor: true,
    saved_broadcaster: true,
  });
  await advanceToChoices(page);
  await checkSafeLayout(page, { expectDesktopSide: false });
  await page.screenshot({ path: `${screenshotDir}/fix-layout-landscape.png` });

  expect(consoleErrors).toEqual([]);
});
