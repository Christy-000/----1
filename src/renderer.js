import {
  classNames,
  describeTimestamp,
  escapeHtml,
  resolveAsset,
  resolveVisibleChoices,
  splitParagraphs,
} from "./utils.js";
import { getWarnings } from "./game-state.js";
import { getDifficultyLabel } from "./difficulty.js";

const SCREEN_LABELS = {
  "main-menu": "MAIN MENU",
  "road-screen": "ROAD",
  "scavenge-screen": "SCAVENGE",
  "character-screen": "CHARACTER",
  "crisis-screen": "CRISIS",
  "night-screen": "NIGHT",
  "ending-screen": "ENDING",
  "endless-action-screen": "ENDLESS",
  "status-screen": "STATUS",
};

const RISK_LABELS = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
  unknown: "未知",
};

const HUD_ITEMS = [
  ["water", "水"],
  ["food", "食物"],
  ["fuel", "燃油"],
  ["medicine", "药"],
  ["parts", "零件"],
  ["battery", "电"],
  ["vehicle", "车况"],
  ["infection", "感染"],
  ["morale", "士气"],
  ["trust", "信任"],
  ["hope", "希望"],
];

export function renderMainMenu(root, scene, options) {
  const { handlers, hasSave, saveInfo, soundOn, menuNotice } = options;
  root.innerHTML = screenShell(scene, soundOn, {
    bodyClass: "main-menu-body",
    content: `
      <section class="cover-copy" data-testid="main-menu">
        <div class="chapter-label">${escapeHtml(scene.tags?.[0] || "SURVIVAL LOG")}｜${escapeHtml(scene.tags?.[1] || "DAY 0")}</div>
        <h1>灰潮之后</h1>
        <p class="subtitle">After the Grey Tide</p>
        <div class="cover-warning" data-testid="text-box"><div data-testid="dialogue-text">${renderParagraphs(scene.pages.join("\n"))}</div></div>
        ${menuNotice ? `<div class="menu-notice" data-testid="menu-notice">${renderParagraphs(menuNotice)}</div>` : ""}
      </section>
      <nav class="menu-actions" aria-label="主菜单">
        <button class="primary" data-action="new-game" data-testid="new-journey">新的旅程</button>
        <button data-action="continue" data-testid="continue-journey" ${hasSave ? "" : "disabled"}>
          继续旅程<span>${hasSave ? describeTimestamp(saveInfo?.timestamp) : "暂无存档"}</span>
        </button>
        <button data-action="endless" data-testid="endless-mode">无尽公路模式</button>
        <button data-action="info">游戏说明</button>
        <button data-action="settings">设置</button>
      </nav>
    `,
  });

  root.querySelector("[data-sound-toggle]")?.addEventListener("click", handlers.onSoundToggle);
  root.querySelector('[data-action="new-game"]')?.addEventListener("click", handlers.onNewGame);
  root.querySelector('[data-action="continue"]')?.addEventListener("click", handlers.onContinueGame);
  root.querySelector('[data-action="endless"]')?.addEventListener("click", handlers.onEndlessMode);
  root.querySelector('[data-action="info"]')?.addEventListener("click", handlers.onShowInfo);
  root.querySelector('[data-action="settings"]')?.addEventListener("click", handlers.onShowSettings);
}

export function renderScene(root, scene, state, visiblePages, pageIndex, options) {
  const { handlers, feedback, soundOn } = options;
  const safePageIndex = Math.max(0, Math.min(pageIndex, Math.max(visiblePages.length - 1, 0)));
  const isLastPage = safePageIndex >= visiblePages.length - 1;
  const pageText = visiblePages[safePageIndex] || "";
  const warnings = getWarnings(state);
  const joined = Object.values(state.companions || {}).filter((companion) => companion.joined);

  if (scene.type === "ending-screen") {
    renderEndingScene(root, scene, state, visiblePages, resolveVisibleChoices(scene, state), { handlers, soundOn });
    return;
  }

  const choices = isLastPage ? resolveVisibleChoices(scene, state) : [];

  root.innerHTML = screenShell(scene, soundOn, {
    state,
    bodyClass: classNames("scene-body", `screen-${scene.type}`),
    content: `
      <div class="game-layout" data-testid="game-layout">
        ${renderHud(state)}
        <section class="stage" data-testid="stage">
          ${renderSceneHeader(scene, state)}
          ${warnings.length ? renderWarnings(warnings) : ""}
          ${feedback?.length ? renderFeedback(feedback) : ""}
        </section>
        ${renderSidePanel(state, joined)}
        ${renderMobileStatus(state, joined)}
        <article class="dialogue-panel story-panel" data-testid="text-box">
          <div class="dialogue-meta">
            <span>${escapeHtml(SCREEN_LABELS[scene.type] || scene.type)}</span>
            <span>${safePageIndex + 1}/${Math.max(visiblePages.length, 1)}</span>
          </div>
          <div class="dialogue-text" data-testid="dialogue-text">${renderParagraphs(pageText)}</div>
          <div class="pager-controls">
            <button class="ghost" data-action="prev" ${safePageIndex <= 0 ? "disabled" : ""}>上一段</button>
            ${
              isLastPage
                ? `<span class="choice-hint">${choices.length ? "请选择行动" : "暂无可用行动"}</span>`
                : `<button class="primary" data-action="next" data-testid="continue-page">继续</button>`
            }
          </div>
        </article>
        <section class="choices-region" data-testid="choices-region">
          ${
            choices.length
              ? `<div class="choices" data-testid="choices">${choices.map(renderChoiceButton).join("")}</div>`
              : ""
          }
        </section>
      </div>
    `,
  });

  root.querySelector("[data-sound-toggle]")?.addEventListener("click", handlers.onSoundToggle);
  root.querySelector('[data-action="next"]')?.addEventListener("click", handlers.onNextPage);
  root.querySelector('[data-action="prev"]')?.addEventListener("click", handlers.onPrevPage);
  root.querySelectorAll("[data-choice-index]").forEach((button) => {
    button.addEventListener("click", () => handlers.onChoice(Number(button.dataset.choiceIndex)));
  });
}

function renderEndingScene(root, scene, state, visiblePages, choices, options) {
  const { handlers, soundOn } = options;
  const copyClass = visiblePages.length > 5 ? "ending-copy ending-copy-long" : "ending-copy";
  root.innerHTML = screenShell(scene, soundOn, {
    state,
    bodyClass: "scene-body screen-ending-screen",
    content: `
      <section class="ending-layout" data-testid="ending-layout">
        <div class="${copyClass}" data-testid="text-box">
          <div class="ending-meta">
            <span>${escapeHtml(scene.location || "旅程终点")}</span>
            <span>${escapeHtml(SCREEN_LABELS[scene.type] || "ENDING")}</span>
          </div>
          <h1>${escapeHtml(scene.title)}</h1>
          <div class="ending-text" data-testid="dialogue-text">${renderParagraphs(visiblePages.join("\n\n"))}</div>
        </div>
        ${
          choices.length
            ? `<nav class="ending-actions" data-testid="choices">${choices.map(renderChoiceButton).join("")}</nav>`
            : ""
        }
      </section>
    `,
  });

  root.querySelector("[data-sound-toggle]")?.addEventListener("click", handlers.onSoundToggle);
  root.querySelectorAll("[data-choice-index]").forEach((button) => {
    button.addEventListener("click", () => handlers.onChoice(Number(button.dataset.choiceIndex)));
  });
}

function screenShell(scene, soundOn, { content, bodyClass = "", state = null }) {
  const background = resolveAsset(scene.background, "images/scenes/grey_highway.png");
  return `
    <main class="game-screen ${escapeHtml(bodyClass)}" data-screen-type="${escapeHtml(scene.type)}">
      <img class="scene-background" src="${escapeHtml(background)}" alt="" data-testid="scene-background">
      <div class="screen-vignette"></div>
      <div class="screen-grain"></div>
      <button class="sound-toggle" data-sound-toggle data-testid="sound-toggle" aria-pressed="${soundOn ? "true" : "false"}">
        SOUND ${soundOn ? "ON" : "OFF"}
      </button>
      ${state?.endless_day ? `<div class="endless-badge">无尽 ${state.endless_day}</div>` : ""}
      ${content}
    </main>
  `;
}

function renderHud(state) {
  return `
    <header class="hud" data-testid="hud">
      <span class="hud-day">DAY ${state.day}</span>
      <span class="hud-item difficulty" data-resource="difficulty"><b>难度</b>${escapeHtml(getDifficultyLabel(state.difficulty))}</span>
      ${HUD_ITEMS.map(([key, label]) => renderHudItem(key, label, state[key])).join("")}
      ${renderCrewTags(state)}
    </header>
  `;
}

function renderHudItem(key, label, value) {
  const number = Number.isFinite(Number(value)) ? Number(value) : 0;
  const danger =
    (["water", "food"].includes(key) && number <= 2) ||
    (key === "fuel" && number <= 1) ||
    (key === "vehicle" && number <= 35) ||
    (key === "infection" && number >= 65);
  const warn = key === "noise" && number >= 70;
  return `<span class="hud-item ${danger ? "danger" : warn ? "warn" : ""}" data-resource="${key}"><b>${label}</b>${number}</span>`;
}

function renderCrewTags(state) {
  const tags = Object.values(state.companions || {})
    .filter((companion) => companion.joined)
    .map((companion) => `<span class="crew-tag">${escapeHtml(companion.name)}</span>`)
    .join("");
  return tags ? `<span class="crew-tags">${tags}</span>` : "";
}

function renderSceneHeader(scene, state) {
  return `
    <section class="scene-header" data-testid="scene-header">
      <div>
        <p>${escapeHtml(scene.location || state?.location || "未知地点")}</p>
        <h2>${escapeHtml(scene.title)}</h2>
      </div>
      <div class="tag-row">${(scene.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    </section>
  `;
}

function renderWarnings(warnings) {
  return `<aside class="warning-bar" data-testid="warning-bar">${warnings.map((warning) => `<span>${escapeHtml(warning)}</span>`).join("")}</aside>`;
}

function renderSidePanel(state, joined) {
  return `
    <aside class="side-panel" data-testid="status-panel">
      <div class="side-panel-inner">
        ${renderStatusContent(state, joined)}
      </div>
    </aside>
  `;
}

function renderMobileStatus(state, joined) {
  return `
    <details class="mobile-status-drawer" data-testid="mobile-status-drawer">
      <summary>状态</summary>
      <div class="mobile-status-body">
        ${renderStatusContent(state, joined)}
      </div>
    </details>
  `;
}

function renderStatusContent(state, joined) {
  const companions = Object.values(state.companions || {});
  return `
    <h3>房车状态</h3>
    <p>${vehicleLine(state)}</p>
    <div class="mini-grid">
      <span>冷酷 ${state.cold}</span>
      <span>噪音 ${state.noise}</span>
      <span class="radio-stat">真相 ${state.broadcast_truth}</span>
    </div>
    <h3>同伴</h3>
    <div class="companion-list" data-testid="companion-list">
      ${companions
        .map(
          (companion) => `
            <div class="companion-card ${companion.joined ? "joined" : "not-joined"}" data-testid="companion-card">
              <strong>${escapeHtml(companion.name)}</strong>
              <span>${escapeHtml(companion.role)}｜${companion.joined ? "在车上" : "未加入"}</span>
            </div>
          `,
        )
        .join("")}
    </div>
    ${joined.length ? `<p class="effect-note">${joined.map((item) => `${escapeHtml(item.name)}：${escapeHtml(item.effect)}`).join("<br>")}</p>` : ""}
    ${renderUpgradeTags(state)}
  `;
}

function vehicleLine(state) {
  const lines = [];
  if (state.saved_child) lines.push("副驾驶座下面放着小满的旧书包。");
  if (state.saved_mechanic) lines.push("车尾有阿森的工具箱，旁边放着一块渗油的布。");
  if (state.saved_doctor) lines.push("小桌边固定着陈医生的药箱。");
  if (state.saved_broadcaster) lines.push("收音机旁贴着老周手写的频率表。");
  const upgrades = getUpgradeLabels(state);
  if (upgrades.length) lines.push(`已改装：${upgrades.join("、")}`);
  return lines.length ? lines.join("<br>") : "储物柜里有压缩饼干、水和旧地图。";
}

function renderUpgradeTags(state) {
  const upgrades = getUpgradeLabels(state);
  if (!upgrades.length) return "";
  return `
    <div class="upgrade-list" data-testid="upgrade-list">
      <h3>改装</h3>
      <div>${upgrades.map((upgrade) => `<span>${escapeHtml(upgrade)}</span>`).join("")}</div>
    </div>
  `;
}

function getUpgradeLabels(state) {
  return [
    ["upgrade_door", "加固车门"],
    ["upgrade_engine", "静音引擎"],
    ["upgrade_medbay", "医疗位"],
    ["upgrade_storage", "储物柜"],
    ["upgrade_watchtower", "观察哨"],
  ]
    .filter(([key]) => state[key])
    .map(([, label]) => label);
}

function renderFeedback(feedback) {
  return `
    <aside class="result-feedback" data-testid="result-feedback">
      <strong>结果</strong>
      ${feedback.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
    </aside>
  `;
}

function renderChoiceButton(choice, index) {
  const risk = choice.risk || "unknown";
  return `
    <button class="choice-button risk-${escapeHtml(risk)}" data-choice-index="${index}" data-testid="choice">
      <span>${escapeHtml(choice.text)}</span>
      <small>${escapeHtml(RISK_LABELS[risk] || risk)}</small>
    </button>
  `;
}

function renderParagraphs(text) {
  return splitParagraphs(text)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}
