import { AudioController } from "./audio.js";
import {
  applyEarlyGraceProtection,
  applyEffects,
  applyNightSettlement,
  createInitialState,
  getGameOverSceneId,
  getRaidRisk,
  getWarnings,
  judgeEnding,
  normalizeState,
} from "./game-state.js";
import { getStartingBonus } from "./difficulty.js";
import { getScene, selectEndlessSupplyScene } from "./scenes.js";
import { autoSave, clearSave, hasSave, loadGame } from "./save.js";
import { resolveVisibleChoices, resolveVisiblePages } from "./utils.js";
import { renderMainMenu, renderScene } from "./renderer.js";

const root = document.querySelector("#game-root");
const audio = new AudioController();

let state = createInitialState();
let currentSceneId = "start_menu";
let pageIndex = 0;
let lastFeedback = [];
let menuNotice = "";
let feedbackTimer = 0;

audio.init();

window.__GREY_TIDE__ = {
  getState: () => structuredClone(state),
  getCurrentSceneId: () => currentSceneId,
  getPageIndex: () => pageIndex,
  clearSave,
  startNewGame,
  startEndlessMode,
  setStateForTest: (partialState) => {
    state = normalizeState({ ...state, ...partialState });
    renderCurrent();
  },
  goToSceneForTest: (sceneId) => enterScene(sceneId, { applyOnEnter: false, save: false }),
};

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLButtonElement) return;
  if (!["Enter", " "].includes(event.key)) return;
  const scene = getScene(currentSceneId);
  if (scene.type === "main-menu") return;
  const pages = resolveVisiblePages(scene, state);
  if (pageIndex < pages.length - 1) {
    event.preventDefault();
    nextPage();
  }
});

function renderCurrent() {
  const scene = getScene(currentSceneId);
  audio.playScene(scene);

  if (scene.type === "main-menu") {
    renderMainMenu(root, scene, {
      handlers: menuHandlers,
      hasSave: hasSave(),
      saveInfo: loadGame(),
      soundOn: audio.isEnabled(),
      menuNotice,
    });
    return;
  }

  const pages = resolveVisiblePages(scene, state);
  if (pageIndex >= pages.length) pageIndex = Math.max(0, pages.length - 1);

  renderScene(root, scene, state, pages, pageIndex, {
    handlers: sceneHandlers,
    feedback: lastFeedback,
    soundOn: audio.isEnabled(),
  });
}

const menuHandlers = {
  onNewGame: () => {
    audio.unlock();
    audio.playClick();
    startNewGame();
  },
  onContinueGame: () => {
    audio.unlock();
    audio.playClick();
    continueGame();
  },
  onEndlessMode: () => {
    audio.unlock();
    audio.playClick();
    startEndlessMode();
  },
  onShowInfo: () => {
    audio.playClick();
    menuNotice =
      "固定背景、文本分页、最后一页选择行动。资源、同伴、感染、广播真相和隐藏值会影响 Day3-Day7、结局与无尽公路事件。";
    renderCurrent();
  },
  onShowSettings: () => {
    audio.playClick();
    const soundOn = audio.toggle();
    menuNotice = `声音已${soundOn ? "开启" : "关闭"}。设置会保存在本地浏览器。`;
    renderCurrent();
  },
  onSoundToggle: () => {
    audio.toggle();
    renderCurrent();
  },
};

const sceneHandlers = {
  onNextPage: () => {
    audio.unlock();
    audio.playClick();
    nextPage();
  },
  onPrevPage: () => {
    audio.playClick();
    pageIndex = Math.max(0, pageIndex - 1);
    saveProgress();
    renderCurrent();
  },
  onChoice: (choiceIndex) => {
    audio.unlock();
    audio.playClick();
    choose(choiceIndex);
  },
  onSoundToggle: () => {
    audio.toggle();
    renderCurrent();
  },
};

renderCurrent();

function startNewGame() {
  state = createInitialState();
  currentSceneId = "difficulty_select";
  pageIndex = 0;
  lastFeedback = [];
  menuNotice = "";
  enterScene(currentSceneId, { applyOnEnter: false });
}

function startEndlessMode() {
  state = createInitialState({ day: 8, endless_day: 1, difficulty: "normal" });
  currentSceneId = "endless_start";
  pageIndex = 0;
  lastFeedback = [];
  menuNotice = "";
  enterScene(currentSceneId, { applyOnEnter: true });
}

function continueGame() {
  const saved = loadGame();
  if (!saved) return;
  state = normalizeState(saved.state);
  currentSceneId = saved.currentSceneId || "day1_morning";
  pageIndex = Number.isFinite(Number(saved.pageIndex)) ? Number(saved.pageIndex) : 0;
  lastFeedback = [];
  menuNotice = "";
  renderCurrent();
}

function nextPage() {
  const scene = getScene(currentSceneId);
  const pages = resolveVisiblePages(scene, state);
  pageIndex = Math.min(pageIndex + 1, Math.max(0, pages.length - 1));
  saveProgress();
  renderCurrent();
}

function choose(choiceIndex) {
  const scene = getScene(currentSceneId);
  const choices = resolveVisibleChoices(scene, state);
  const choice = choices[choiceIndex];
  if (!choice) return;

  const result = applyEffects(state, choice.effects || {}, {
    sceneId: currentSceneId,
    choiceText: choice.text,
    sceneType: scene.type,
  });
  state = result.state;
  lastFeedback = result.feedback;

  if (currentSceneId === "difficulty_select" && choice.difficulty) {
    const bonus = applyEffects(state, getStartingBonus(choice.difficulty), {
      sceneId: currentSceneId,
      choiceText: "difficulty_starting_bonus",
      sceneType: scene.type,
    });
    state = bonus.state;
    lastFeedback = [...lastFeedback, ...bonus.feedback];
  }

  if (getWarnings(state).length) audio.playWarning();

  if (choice.action === "menu") {
    currentSceneId = "start_menu";
    pageIndex = 0;
    saveProgress();
    renderCurrent();
    return;
  }

  if (choice.action === "restart") {
    startNewGame();
    return;
  }

  enterScene(resolveChoiceNext(choice.next), { applyOnEnter: true });
}

function enterScene(sceneId, { applyOnEnter = true, save = true } = {}) {
  currentSceneId = sceneId || "start_menu";
  pageIndex = 0;
  const scene = getScene(currentSceneId);

  if (applyOnEnter && scene.onEnter) {
    const entryFeedback = applySceneEntry(scene);
    if (entryFeedback.length) lastFeedback = [...lastFeedback, ...entryFeedback];
  }

  state = normalizeState(state);
  const grace = applyEarlyGraceProtection(state);
  state = grace.state;
  if (grace.feedback.length) lastFeedback = [...lastFeedback, ...grace.feedback];

  const gameOverSceneId = getGameOverSceneId(state);
  if (gameOverSceneId && shouldInterruptForGameOver(scene)) {
    enterScene(gameOverSceneId, { applyOnEnter: false, save });
    return;
  }

  const autoRouteSceneId = resolveSceneAutoRoute(scene);
  if (autoRouteSceneId) {
    enterScene(autoRouteSceneId, { applyOnEnter: true, save });
    return;
  }

  if (save && scene.type !== "main-menu") saveProgress();
  showFeedbackTemporarily();
  renderCurrent();
}

function applySceneEntry(scene) {
  let feedback = [];
  if (scene.onEnter.nightSettlement) {
    const settlement = applyNightSettlement(state);
    state = settlement.state;
    feedback = feedback.concat(settlement.feedback);
  }

  const simpleEffects = { ...scene.onEnter };
  delete simpleEffects.nightSettlement;
  delete simpleEffects.raidCheck;
  delete simpleEffects.endingJudge;
  if (Object.keys(simpleEffects).length) {
    const result = applyEffects(state, simpleEffects, {
      sceneId: scene.id,
      choiceText: "scene_entry",
      sceneType: scene.type,
    });
    state = result.state;
    feedback = feedback.concat(result.feedback);
  }

  return feedback;
}

function resolveChoiceNext(nextSceneId) {
  if (nextSceneId === "@endless_supply") return selectEndlessSupplyScene(state);
  return nextSceneId;
}

function resolveSceneAutoRoute(scene) {
  if (!scene.onEnter) return "";

  if (scene.onEnter.endingJudge) {
    const endingSceneId = judgeEnding(state);
    lastFeedback = [...lastFeedback, "结局判定完成"];
    return endingSceneId;
  }

  if (scene.onEnter.raidCheck) {
    const risk = getRaidRisk(state);
    state.flags.last_raid_risk = risk;
    lastFeedback = [...lastFeedback, `夜袭风险 ${risk}%`];
    return risk >= 35 ? "endless_raid" : "endless_safe_night";
  }

  return "";
}

function shouldInterruptForGameOver(scene) {
  if (scene.type === "main-menu" || scene.type === "ending-screen") return false;
  return !currentSceneId.startsWith("game_over_");
}

function saveProgress() {
  autoSave({
    currentSceneId,
    pageIndex,
    state,
  });
}

function showFeedbackTemporarily() {
  window.clearTimeout(feedbackTimer);
  if (!lastFeedback.length) return;
  feedbackTimer = window.setTimeout(() => {
    lastFeedback = [];
    renderCurrent();
  }, 3600);
}
