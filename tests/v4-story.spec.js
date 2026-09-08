const { expect, test } = require("playwright/test");

async function startFresh(page) {
  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId("new-journey").click();
  await page.getByTestId("continue-page").click();
  await page.locator("[data-choice-index]").nth(1).click();
}

async function advanceToChoices(page, maxSteps = 16) {
  for (let index = 0; index < maxSteps; index += 1) {
    const choices = page.getByTestId("choices");
    if (await choices.isVisible().catch(() => false)) return;
    const next = page.getByTestId("continue-page");
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    }
  }
  throw new Error("choices did not appear");
}

async function clickChoiceIndex(page, index, maxSteps = 16) {
  await advanceToChoices(page, maxSteps);
  await page.locator("[data-choice-index]").nth(index).click();
}

test("vertical slice from Day1 to Day2 engine problem is playable", async ({ page }) => {
  await startFresh(page);

  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day1_morning");
  await page.getByTestId("continue-page").click();

  await clickChoiceIndex(page, 0);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day1_store");
  await advanceToChoices(page);
  await expect(page.getByTestId("choices").getByTestId("choice")).toHaveCount(3);
  await page.locator("[data-choice-index]").nth(1).click();

  await clickChoiceIndex(page, 0);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().saved_child)).toBe(true);

  await clickChoiceIndex(page, 0);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day2_morning");
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().companions.child.joined)).toBe(true);

  await clickChoiceIndex(page, 0);
  await clickChoiceIndex(page, 0);

  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day2_mechanic");
  await advanceToChoices(page);
  await expect(page.getByTestId("choices").getByTestId("choice")).toHaveCount(3);

  await page.locator("[data-choice-index]").nth(1).click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().saved_mechanic)).toBe(true);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day2_engine_problem");

  await advanceToChoices(page);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().companions.mechanic.joined)).toBe(true);
  await expect(page.getByTestId("result-feedback")).toBeVisible();
});

test("Day3 to Day7 finale route remains reachable from a prepared state", async ({ page }) => {
  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => Boolean(window.__GREY_TIDE__));
  await page.evaluate(() => {
    window.__GREY_TIDE__.setStateForTest({
      difficulty: "normal",
      day: 7,
      water: 8,
      food: 8,
      fuel: 6,
      medicine: 4,
      parts: 6,
      vehicle: 80,
      infection: 18,
      trust: 55,
      saved_child: true,
      saved_mechanic: true,
      saved_doctor: true,
      saved_broadcaster: true,
      broadcast_truth: 5,
    });
    window.__GREY_TIDE__.goToSceneForTest("day7_final_blockade");
  });

  await clickChoiceIndex(page, 0);
  await clickChoiceIndex(page, 0);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("ending_broadcast_truth");
});
