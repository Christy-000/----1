const { expect, test } = require("playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { pathToFileURL } = require("node:url");

const rootDir = path.resolve(".");
const scenesPath = path.join(rootDir, "src/scenes.js");
const standalonePath = path.join(rootDir, "dist/grey-tide-standalone.js");

const forbiddenTextPatterns = [
  { reason: "replacement character", pattern: /\uFFFD/ },
  { reason: "double full stop", pattern: /\u3002\u3002/ },
  { reason: "double comma", pattern: /\uFF0C\uFF0C/ },
  { reason: "comma before full stop", pattern: /\uFF0C\u3002/ },
  { reason: "truncated main menu text", pattern: /\u8FD4\u56DE\u4E3B\u83DC\u3002/ },
  { reason: "truncated restart text", pattern: /\u91CD\u65B0\u5F00\u3002/ },
  { reason: "truncated next-day text", pattern: /\u8FDB\u5165\u4E0B\u4E00\u3002/ },
  { reason: "truncated tonight text", pattern: /\u71AC\u8FC7\u4ECA\u3002/ },
  { reason: "truncated service-area text", pattern: /\u8FDB\u5165\u670D\u52A1\u3002/ },
  { reason: "truncated food text", pattern: /\u4E00\u6279\u98DF\u3002/ },
  { reason: "truncated partial-return text", pattern: /\u4EA4\u56DE\u4E00\u3002/ },
  { reason: "truncated blame text", pattern: /\u63A8\u7ED9\u522B\u3002/ },
  { reason: "truncated broadcast-station text", pattern: /\u8FDB\u5165\u5E7F\u64AD\u3002/ },
  { reason: "truncated receiver text", pattern: /\u4FEE\u597D\u63A5\u6536\u3002/ },
  { reason: "truncated wire text", pattern: /\u62C6\u8D70\u7535\u6C60\u548C\u7EBF\u3002/ },
  { reason: "truncated blockade text", pattern: /\u9760\u8FD1\u5C01\u9501\u3002/ },
  { reason: "truncated drive-out text", pattern: /\u53D1\u52A8\u51B2\u51FA\u3002/ },
  { reason: "truncated doctor tag", pattern: /\u9648\u533B\u3002/ },
  { reason: "likely typo glyph", pattern: /[\u6762\u6DE2]/ },
  { reason: "awkward search wording", pattern: /\u8981\u4EC0\u4E48\u641C/ },
  { reason: "question ending with full stop", pattern: /\u600E\u4E48\u5904\u7406\u3002/ },
  { reason: "malformed scare wording", pattern: /\u5413\uFF0C\u5B83\u4EEC/ },
  { reason: "malformed risk-personnel quote", pattern: /\u98CE\u9669\u4EBA\u5458\uFF0C\uFF0C/ },
  { reason: "malformed 71.3 sentence", pattern: /\u4F60\u4EEC\u300271\.3/ },
];

function loadScenesModule() {
  let source = fs.readFileSync(scenesPath, "utf8").replace(/^\uFEFF/, "");
  source = source.replace(/export const SCENES\s*=/, "const SCENES =");
  source = source.replace(/export function /g, "function ");
  source += "\nglobalThis.__SCENES = SCENES;";

  const context = { globalThis: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "src/scenes.js" });
  return context.globalThis.__SCENES;
}

function sceneStrings(scene) {
  const strings = [
    ["title", scene.title],
    ["location", scene.location],
    ...(scene.tags || []).map((text, index) => [`tag[${index}]`, text]),
    ...(scene.pages || []).map((page, index) => [`page[${index}]`, typeof page === "string" ? page : page.text]),
    ...(scene.choices || []).map((choice, index) => [`choice[${index}]`, choice.text]),
  ];
  return strings.filter(([, text]) => typeof text === "string");
}

function collectTextIssues(scenes) {
  const issues = [];
  for (const [sceneId, scene] of Object.entries(scenes)) {
    for (const [field, text] of sceneStrings(scene)) {
      for (const { reason, pattern } of forbiddenTextPatterns) {
        if (pattern.test(text)) issues.push({ sceneId, field, reason, text });
      }

      const openQuotes = (text.match(/\u201C/g) || []).length;
      const closeQuotes = (text.match(/\u201D/g) || []).length;
      if (openQuotes !== closeQuotes) {
        issues.push({ sceneId, field, reason: "unbalanced Chinese quotes", text });
      }
      if (field.startsWith("choice[") && text.endsWith("\u3002")) {
        issues.push({ sceneId, field, reason: "choice label ends with full stop", text });
      }
    }
  }
  return issues;
}

function assertExactPathCase(relativePath) {
  const parts = relativePath.split("/");
  let cursor = rootDir;
  for (const part of parts) {
    const names = fs.readdirSync(cursor);
    expect(names, `${relativePath} exact path segment ${part}`).toContain(part);
    cursor = path.join(cursor, part);
  }
  expect(fs.existsSync(cursor), relativePath).toBeTruthy();
}

test("scene text stays free of obvious encoding and proofreading regressions", () => {
  const scenes = loadScenesModule();
  const issues = collectTextIssues(scenes);
  expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
});

test("scene route graph and scene backgrounds remain intact", () => {
  const scenes = loadScenesModule();
  const routeIssues = [];
  const allowedDynamicNext = new Set(["@endless_supply"]);

  for (const [sceneId, scene] of Object.entries(scenes)) {
    if (scene.background) assertExactPathCase(scene.background);

    for (const choice of scene.choices || []) {
      if (!choice.next) continue;
      if (choice.next.startsWith("@")) {
        if (!allowedDynamicNext.has(choice.next)) {
          routeIssues.push({ sceneId, text: choice.text, next: choice.next, reason: "unknown dynamic route" });
        }
        continue;
      }

      if (!scenes[choice.next]) {
        routeIssues.push({ sceneId, text: choice.text, next: choice.next, reason: "missing next scene" });
      }
    }
  }

  expect(routeIssues, JSON.stringify(routeIssues, null, 2)).toEqual([]);
  expect(scenes.difficulty_select?.choices?.map((choice) => choice.next)).toEqual([
    "day1_morning",
    "day1_morning",
    "day1_morning",
  ]);
  expect(scenes.day1_morning?.choices?.some((choice) => choice.next === "day1_store")).toBeTruthy();
  expect(scenes.day1_store?.choices?.every((choice) => choice.next === "day1_night")).toBeTruthy();
  expect(scenes.day1_night?.choices?.some((choice) => choice.next === "day1_save_child")).toBeTruthy();
  expect(scenes.day1_save_child?.choices?.some((choice) => choice.next === "day2_morning")).toBeTruthy();
  expect(scenes.endless_start).toBeTruthy();
  expect(scenes.endless_action_select?.choices?.some((choice) => choice.next === "@endless_supply")).toBeTruthy();
});

test("standalone file bundle stays in sync with ending text and layout fixes", async ({ page }) => {
  const standalone = fs.readFileSync(standalonePath, "utf8");
  for (const { reason, pattern } of forbiddenTextPatterns) {
    expect(standalone, `dist bundle contains ${reason}`).not.toMatch(pattern);
  }
  expect(standalone).toContain("renderEndingScene");
  expect(standalone).toContain("ending-layout");
  expect(standalone).toContain("返回主菜单");
  expect(standalone).toContain("重新开始");

  await page.goto(pathToFileURL(path.join(rootDir, "index.html")).href);
  await page.waitForFunction(() => Boolean(window.__GREY_TIDE__));
  await page.evaluate(() => {
    window.__GREY_TIDE__.setStateForTest({ fuel: 0, day: 5 });
    window.__GREY_TIDE__.goToSceneForTest("game_over_fuel");
  });

  await expect(page.getByTestId("ending-layout")).toBeVisible();
  await expect(page.getByText("重新开始")).toBeVisible();
  await expect(page.getByText("返回主菜单")).toBeVisible();
  await expect(page.getByText("重新开。")).toHaveCount(0);
  await expect(page.getByText("返回主菜。")).toHaveCount(0);
});
