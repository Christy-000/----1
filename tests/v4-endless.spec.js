const { expect, test } = require("playwright/test");

async function openScene(page, sceneId, state = {}) {
  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => Boolean(window.__GREY_TIDE__));
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

async function clickChoiceIndex(page, index) {
  await advanceToChoices(page);
  await page.locator("[data-choice-index]").nth(index).click();
}

test("endless mode has upgrades, conditional supply events, and raid routing", async ({ page }) => {
  await openScene(page, "endless_action_select", {
    day: 8,
    endless_day: 1,
    flags: { endless_mode: true },
    food: 8,
    water: 8,
    fuel: 8,
    parts: 6,
  });

  await advanceToChoices(page);
  await expect(page.locator("[data-choice-index]")).toHaveCount(6);

  await clickChoiceIndex(page, 5);
  await expect
    .poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId()))
    .toBe("endless_upgrade");

  await clickChoiceIndex(page, 3);
  await expect
    .poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().upgrade_storage))
    .toBe(true);
  await expect(page.getByTestId("status-panel").getByTestId("upgrade-list")).toBeVisible();

  await page.evaluate(() => {
    window.__GREY_TIDE__.setStateForTest({ water: 2, noise: 20 });
    window.__GREY_TIDE__.goToSceneForTest("endless_action_select");
  });
  await clickChoiceIndex(page, 1);
  await expect
    .poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId()))
    .toBe("endless_station_water");

  await page.evaluate(() => window.__GREY_TIDE__.setStateForTest({ noise: 80, fuel: 6, water: 6, food: 6 }));
  await clickChoiceIndex(page, 0);
  await expect
    .poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId()))
    .toBe("endless_raid");
  await expect(page.getByTestId("result-feedback")).toContainText("夜袭风险");
});
