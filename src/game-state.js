import {
  adjustEffectDelta,
  DEFAULT_DIFFICULTY,
  getDifficultyConfig,
  normalizeDifficulty,
  scaleNightCost,
} from "./difficulty.js";
import { clampNumber, deepClone, formatSigned, isPlainObject, safeNumber } from "./utils.js";

export const INITIAL_STATE = {
  day: 1,
  difficulty: DEFAULT_DIFFICULTY,
  water: 6,
  food: 8,
  fuel: 5,
  medicine: 2,
  parts: 3,
  battery: 4,
  vehicle: 85,
  infection: 12,
  morale: 50,
  trust: 50,
  noise: 10,
  cold: 0,
  hope: 50,
  saved_child: false,
  saved_mechanic: false,
  saved_doctor: false,
  saved_broadcaster: false,
  broadcast_truth: 0,
  endless_day: 0,
  upgrade_door: false,
  upgrade_engine: false,
  upgrade_medbay: false,
  upgrade_storage: false,
  upgrade_watchtower: false,
  log: [],
  flags: {},
  companions: {
    child: {
      name: "小满",
      role: "孩子",
      joined: false,
      trust: 60,
      effect: "提升希望，但增加食物消耗",
    },
    mechanic: {
      name: "阿森",
      role: "修车工",
      joined: false,
      trust: 70,
      effect: "夜晚自动修复少量车况",
    },
    doctor: {
      name: "陈医生",
      role: "医生",
      joined: false,
      trust: 65,
      effect: "降低感染风险",
    },
    broadcaster: {
      name: "老周",
      role: "广播员",
      joined: false,
      trust: 55,
      effect: "解锁广播真相线",
    },
  },
};

export const RESOURCE_LIMITS = {
  water: [0, 99],
  food: [0, 99],
  fuel: [0, 99],
  medicine: [0, 99],
  parts: [0, 99],
  battery: [0, 99],
  vehicle: [0, 100],
  infection: [0, 100],
  morale: [0, 100],
  trust: [0, 100],
  noise: [0, 100],
  cold: [0, 100],
  hope: [0, 100],
  broadcast_truth: [0, 100],
  endless_day: [0, 999],
  day: [1, 999],
};

export const EFFECT_LABELS = {
  water: "水",
  food: "食物",
  fuel: "燃油",
  medicine: "药品",
  parts: "零件",
  battery: "电池",
  vehicle: "车况",
  infection: "感染风险",
  morale: "士气",
  trust: "信任",
  noise: "噪音",
  cold: "冷酷",
  hope: "希望",
  broadcast_truth: "广播真相",
  endless_day: "无尽天数",
  day: "天数",
  saved_child: "小满",
  saved_mechanic: "阿森",
  saved_doctor: "陈医生",
  saved_broadcaster: "老周",
  upgrade_door: "加固车门",
  upgrade_engine: "静音引擎",
  upgrade_medbay: "简易医疗区",
  upgrade_storage: "扩容储物柜",
  upgrade_watchtower: "车顶观察位",
};

export function createInitialState(overrides = {}) {
  return normalizeState({
    ...deepClone(INITIAL_STATE),
    ...deepClone(overrides),
  });
}

export function normalizeState(input = {}) {
  const state = deepClone(INITIAL_STATE);
  mergeInto(state, input);

  for (const [key, [min, max]] of Object.entries(RESOURCE_LIMITS)) {
    state[key] = clampNumber(state[key], min, max);
  }

  state.saved_child = Boolean(state.saved_child);
  state.saved_mechanic = Boolean(state.saved_mechanic);
  state.saved_doctor = Boolean(state.saved_doctor);
  state.saved_broadcaster = Boolean(state.saved_broadcaster);
  state.upgrade_door = Boolean(state.upgrade_door);
  state.upgrade_engine = Boolean(state.upgrade_engine);
  state.upgrade_medbay = Boolean(state.upgrade_medbay);
  state.upgrade_storage = Boolean(state.upgrade_storage);
  state.upgrade_watchtower = Boolean(state.upgrade_watchtower);
  state.flags = isPlainObject(state.flags) ? state.flags : {};
  state.log = Array.isArray(state.log) ? state.log : [];
  state.difficulty = normalizeDifficulty(state.difficulty);

  state.companions = {
    ...deepClone(INITIAL_STATE.companions),
    ...(isPlainObject(state.companions) ? state.companions : {}),
  };

  syncCompanions(state);
  return state;
}

export function syncCompanions(state) {
  state.companions.child.joined = Boolean(state.saved_child);
  state.companions.mechanic.joined = Boolean(state.saved_mechanic);
  state.companions.doctor.joined = Boolean(state.saved_doctor);
  state.companions.broadcaster.joined = Boolean(state.saved_broadcaster);
  return state;
}

export function applyEffects(state, effects = {}, context = {}) {
  const feedback = [];
  const nextState = normalizeState(state);
  let scavengeBonusUsed = false;

  applySetEffects(nextState, effects.set, feedback);
  applyEnsureMin(nextState, effects.ensureMin, feedback);
  applyClampMax(nextState, effects.clampMax, feedback);

  for (const [key, value] of Object.entries(effects)) {
    if (["set", "ensureMin", "clampMax", "flags", "companions"].includes(key)) continue;

    if (typeof value === "number") {
      const before = safeNumber(nextState[key], 0);
      const [min, max] = RESOURCE_LIMITS[key] || [-999, 999];
      const adjusted = adjustEffectDelta(key, value, nextState.difficulty, context, scavengeBonusUsed);
      scavengeBonusUsed = adjusted.scavengeBonusUsed;
      nextState[key] = clampNumber(before + adjusted.value, min, max);
      const delta = nextState[key] - before;
      if (delta !== 0) feedback.push(`${EFFECT_LABELS[key] || key} ${formatSigned(delta)}`);
      continue;
    }

    if (typeof value === "boolean" || typeof value === "string") {
      const before = nextState[key];
      nextState[key] = value;
      if (before !== value) feedback.push(`${EFFECT_LABELS[key] || key}：${value === true ? "已记录" : value}`);
    }
  }

  if (isPlainObject(effects.flags)) {
    for (const [key, value] of Object.entries(effects.flags)) {
      nextState.flags[key] = value;
      feedback.push(`记录：${value === true ? key : `${key}=${value}`}`);
    }
  }

  if (isPlainObject(effects.companions)) {
    mergeInto(nextState.companions, effects.companions);
  }

  syncCompanions(nextState);
  nextState.log.push({
    at: new Date().toISOString(),
    scene: context.sceneId || "",
    choice: context.choiceText || context.reason || "",
    feedback,
  });

  return {
    state: normalizeState(nextState),
    feedback,
  };
}

export function applyNightSettlement(state) {
  const nextState = normalizeState(state);
  if (nextState.day >= 8 || nextState.flags.endless_mode) {
    return applyEndlessNightSettlement(nextState);
  }

  const effects = {
    food: -1,
    water: -1,
  };
  const notes = ["基础消耗：食物 -1，水 -1"];

  if (nextState.saved_child) {
    effects.food -= 1;
    effects.water -= 1;
    effects.hope = 2;
    notes.push("小满：食物 -1，水 -1，希望 +2");
  }

  if (nextState.saved_mechanic) {
    effects.vehicle = 3;
    notes.push("阿森维护车辆：车况 +3");
  }

  if (nextState.saved_doctor) {
    effects.infection = -2;
    notes.push("陈医生夜间检查：感染风险 -2");
  }

  if (nextState.saved_broadcaster) {
    effects.broadcast_truth = 1;
    notes.push("老周监听隐藏频段：广播真相 +1");
  }

  effects.food = scaleNightCost(effects.food, nextState.difficulty);
  effects.water = scaleNightCost(effects.water, nextState.difficulty);

  const result = applyEffects(nextState, effects, { reason: "night_settlement" });
  return {
    state: result.state,
    feedback: [...notes, ...result.feedback],
  };
}

export function getWarnings(state) {
  const warnings = [];
  if (state.water <= 2) warnings.push("水即将耗尽");
  if (state.food <= 2) warnings.push("食物即将耗尽");
  if (state.fuel <= 1) warnings.push("燃油不足");
  if (state.vehicle <= 35) warnings.push("车况危险");
  if (state.infection >= 65) warnings.push("感染风险过高");
  if (state.noise >= 70) warnings.push("噪音过高");
  return warnings;
}

export function applyEndlessNightSettlement(state) {
  const nextState = normalizeState(state);
  const crewCount = getCompanionCount(nextState);
  const effects = {
    food: -1,
    water: -1,
    fuel: -1,
  };
  const notes = ["无尽夜晚：食物 -1，水 -1，燃油 -1"];

  if (crewCount >= 2) {
    effects.food -= 1;
    effects.water -= 1;
    notes.push("队伍配给压力：食物 -1，水 -1");
  }

  if (crewCount >= 4) {
    effects.food -= 1;
    effects.water -= 1;
    notes.push("满员队伍额外压力：食物 -1，水 -1");
  }

  if (nextState.saved_doctor) {
    effects.infection = (effects.infection || 0) - 1;
    notes.push("陈医生夜间巡查：感染风险 -1");
  }

  if (nextState.saved_mechanic) {
    effects.vehicle = (effects.vehicle || 0) + 2;
    notes.push("阿森维护车辆：车况 +2");
  }

  if (nextState.saved_broadcaster) {
    effects.broadcast_truth = (effects.broadcast_truth || 0) + 1;
    notes.push("老周监听隐藏频段：广播真相 +1");
  }

  if (nextState.upgrade_medbay) {
    effects.infection = (effects.infection || 0) - 1;
    notes.push("简易医疗区：感染风险 -1");
  }

  if (nextState.upgrade_engine) {
    effects.noise = (effects.noise || 0) - 2;
    notes.push("静音引擎：噪音 -2");
  }

  const result = applyEffects(nextState, effects, { reason: "endless_night_settlement" });
  return {
    state: result.state,
    feedback: [...notes, ...result.feedback],
  };
}

export function getCompanionCount(state) {
  return Object.values(state.companions || {}).filter((companion) => companion.joined).length;
}

export function getRaidRisk(state) {
  const nextState = normalizeState(state);
  const difficulty = getDifficultyConfig(nextState.difficulty);
  let risk = 10 + nextState.noise;
  if (nextState.vehicle <= 45) risk += 10;
  if (nextState.infection >= 55) risk += 8;
  if (nextState.saved_broadcaster) risk -= 5;
  if (nextState.saved_mechanic) risk -= 3;
  if (nextState.upgrade_engine) risk -= 5;
  if (nextState.upgrade_watchtower) risk -= 5;
  return clampNumber(Math.round(risk * difficulty.riskMultiplier), 5, 65);
}

export function applyEarlyGraceProtection(state) {
  const nextState = normalizeState(state);
  if (
    nextState.difficulty !== "easy" ||
    nextState.flags.endless_mode ||
    nextState.day > 2 ||
    nextState.flags.easy_grace_used
  ) {
    return { state: nextState, feedback: [] };
  }

  for (const key of ["water", "food", "fuel"]) {
    if (nextState[key] <= 0) {
      nextState[key] = 1;
      nextState.flags.easy_grace_used = true;
      const feedback = [`最后储备：${EFFECT_LABELS[key] || key} +1`];
      nextState.log.push({
        at: new Date().toISOString(),
        scene: "difficulty_grace",
        choice: "easy_grace",
        feedback,
      });
      return { state: normalizeState(nextState), feedback };
    }
  }

  return { state: nextState, feedback: [] };
}

export function judgeEnding(state) {
  const nextState = normalizeState(state);
  const companions = getCompanionCount(nextState);
  if (nextState.vehicle <= 20) return "ending_vehicle_failure";
  if (nextState.broadcast_truth >= 5) return "ending_broadcast_truth";
  if (nextState.cold >= 10) return "ending_ruthless_survival";
  if (companions >= 3 && nextState.trust >= 45) return "ending_temporary_family";
  return "ending_lone_road";
}

export function getGameOverSceneId(state) {
  const nextState = normalizeState(state);
  const inFinale = nextState.day >= 7 && !nextState.flags.endless_mode;
  if (nextState.water <= 0 && !inFinale) return "game_over_water";
  if (nextState.food <= 0 && !inFinale) return "game_over_food";
  if (nextState.fuel <= 0 && (nextState.day < 7 || nextState.flags.endless_mode)) return "game_over_fuel";
  if (nextState.vehicle <= 0) return "game_over_vehicle";
  if (nextState.infection >= 100) return "game_over_infection";
  return "";
}

function applySetEffects(state, values, feedback) {
  if (!isPlainObject(values)) return;
  for (const [key, value] of Object.entries(values)) {
    const before = state[key];
    state[key] = value;
    if (before !== value && key in EFFECT_LABELS) feedback.push(`${EFFECT_LABELS[key]}：${value}`);
  }
}

function applyEnsureMin(state, values, feedback) {
  if (!isPlainObject(values)) return;
  for (const [key, value] of Object.entries(values)) {
    const before = safeNumber(state[key], 0);
    if (before < value) {
      state[key] = value;
      feedback.push(`${EFFECT_LABELS[key] || key} 至少 ${value}`);
    }
  }
}

function applyClampMax(state, values, feedback) {
  if (!isPlainObject(values)) return;
  for (const [key, value] of Object.entries(values)) {
    const before = safeNumber(state[key], 0);
    if (before > value) {
      state[key] = value;
      feedback.push(`${EFFECT_LABELS[key] || key} 最高 ${value}`);
    }
  }
}

function mergeInto(target, source) {
  if (!isPlainObject(source)) return target;
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      mergeInto(target[key], value);
    } else {
      target[key] = deepClone(value);
    }
  }
  return target;
}
