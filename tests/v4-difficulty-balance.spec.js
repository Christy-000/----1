const { expect, test } = require("playwright/test");

const SAVE_KEY = "after-grey-tide.v4.save";

async function openClean(page) {
  await page.goto("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => Boolean(window.__GREY_TIDE__));
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

async function startWithDifficulty(page, index) {
  await openClean(page);
  await page.getByTestId("new-journey").click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("difficulty_select");
  await clickChoiceIndex(page, index);
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getCurrentSceneId())).toBe("day1_morning");
  return page.evaluate(() => window.__GREY_TIDE__.getState());
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

test("difficulty selection applies starting resources and persists through save/load", async ({ page }) => {
  const easy = await startWithDifficulty(page, 0);
  expect(easy.difficulty).toBe("easy");
  expect(easy.water).toBe(8);
  expect(easy.food).toBe(10);
  expect(easy.fuel).toBe(6);
  expect(easy.medicine).toBe(3);

  await page.reload();
  await page.getByTestId("continue-journey").click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().difficulty)).toBe("easy");

  const normal = await startWithDifficulty(page, 1);
  expect(normal.difficulty).toBe("normal");
  expect(normal.water).toBe(6);
  expect(normal.food).toBe(8);
  expect(normal.fuel).toBe(5);
  expect(normal.medicine).toBe(2);

  const hard = await startWithDifficulty(page, 2);
  expect(hard.difficulty).toBe("hard");
  expect(hard.water).toBe(5);
  expect(hard.food).toBe(7);
  expect(hard.fuel).toBe(5);
  expect(hard.medicine).toBe(2);
});

test("old saves without difficulty fall back to normal", async ({ page }) => {
  await page.goto("/index.html");
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        currentSceneId: "day1_morning",
        pageIndex: 0,
        state: { water: 6, food: 8, fuel: 5, medicine: 2 },
        log: [],
        timestamp: "legacy-save",
      }),
    );
  }, SAVE_KEY);
  await page.reload();
  await page.getByTestId("continue-journey").click();
  await expect.poll(() => page.evaluate(() => window.__GREY_TIDE__.getState().difficulty)).toBe("normal");
});

test("rescue choices add one-time role-based compensation without rewarding refusal", async ({ page }) => {
  await openScene(page, "day1_night", { difficulty: "normal", food: 8, water: 6, medicine: 2 });
  await clickChoiceIndex(page, 0);
  let state = await page.evaluate(() => window.__GREY_TIDE__.getState());
  expect(state.saved_child).toBe(true);
  expect(state.food).toBe(9);
  expect(state.water).toBe(7);
  expect(state.medicine).toBe(3);
  expect(state.flags.child_found_emergency_pack).toBe(true);

  await openScene(page, "day1_night", { difficulty: "normal", food: 8, water: 6, medicine: 2 });
  await clickChoiceIndex(page, 2);
  state = await page.evaluate(() => window.__GREY_TIDE__.getState());
  expect(state.saved_child).toBe(false);
  expect(state.food).toBe(8);
  expect(state.water).toBe(6);
  expect(state.medicine).toBe(2);

  await openScene(page, "day2_mechanic", { difficulty: "normal", fuel: 5, parts: 3, medicine: 2 });
  await clickChoiceIndex(page, 1);
  state = await page.evaluate(() => window.__GREY_TIDE__.getState());
  expect(state.saved_mechanic).toBe(true);
  expect(state.fuel).toBe(6);
  expect(state.parts).toBe(4);
  expect(state.medicine).toBe(1);
  expect(state.flags.mechanic_checked_fuel_line).toBe(true);

  await openScene(page, "day3_doctor", { difficulty: "normal", food: 8, medicine: 2, infection: 12 });
  await clickChoiceIndex(page, 0);
  state = await page.evaluate(() => window.__GREY_TIDE__.getState());
  expect(state.saved_doctor).toBe(true);
  expect(state.food).toBe(7);
  expect(state.medicine).toBe(3);
  expect(state.infection).toBe(9);
  expect(state.flags.doctor_sorted_medkit).toBe(true);

  await openScene(page, "day5_broadcaster", {
    difficulty: "normal",
    food: 8,
    fuel: 5,
    noise: 10,
    broadcast_truth: 0,
  });
  await clickChoiceIndex(page, 0);
  state = await page.evaluate(() => window.__GREY_TIDE__.getState());
  expect(state.saved_broadcaster).toBe(true);
  expect(state.food).toBe(7);
  expect(state.fuel).toBe(6);
  expect(state.noise).toBe(7);
  expect(state.broadcast_truth).toBe(3);
  expect(state.flags.broadcaster_corrected_route).toBe(true);
});

test("difficulty modifiers keep early balance fair and avoid invalid UI output", async ({ page }) => {
  await openScene(page, "day1_store", { difficulty: "easy", food: 8, water: 6, noise: 10 });
  await clickChoiceIndex(page, 0);
  const easy = await page.evaluate(() => window.__GREY_TIDE__.getState());

  await openScene(page, "day1_store", { difficulty: "hard", food: 8, water: 6, noise: 10 });
  await clickChoiceIndex(page, 0);
  const hard = await page.evaluate(() => window.__GREY_TIDE__.getState());

  expect(easy.food).toBeGreaterThan(hard.food);
  expect(easy.noise).toBeLessThan(hard.noise);

  await openScene(page, "day2_night", {
    difficulty: "normal",
    day: 2,
    food: 4,
    water: 4,
    saved_child: true,
    saved_mechanic: true,
  });
  const normalAfterNight = await page.evaluate(() => window.__GREY_TIDE__.getState());
  expect(normalAfterNight.food).toBeGreaterThan(0);
  expect(normalAfterNight.water).toBeGreaterThan(0);

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toContain("NaN");
  expect(bodyText).not.toContain("undefined");
});
