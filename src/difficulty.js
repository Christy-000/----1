export const DEFAULT_DIFFICULTY = "normal";

export const DIFFICULTY_CONFIG = {
  easy: {
    id: "easy",
    label: "简单",
    description: "资源更宽松，适合先体验剧情。",
    startingBonus: {
      water: 2,
      food: 2,
      fuel: 1,
      medicine: 1,
    },
    consumptionMultiplier: 0.85,
    riskMultiplier: 0.8,
    scavengeBonus: 1,
    infectionMultiplier: 0.8,
    vehicleDamageMultiplier: 0.8,
  },
  normal: {
    id: "normal",
    label: "普通",
    description: "推荐，标准生存压力。",
    startingBonus: {},
    consumptionMultiplier: 1,
    riskMultiplier: 1,
    scavengeBonus: 0,
    infectionMultiplier: 1,
    vehicleDamageMultiplier: 1,
  },
  hard: {
    id: "hard",
    label: "困难",
    description: "资源更少，风险更高。",
    startingBonus: {
      water: -1,
      food: -1,
    },
    consumptionMultiplier: 1.15,
    riskMultiplier: 1.2,
    scavengeBonus: 0,
    infectionMultiplier: 1.2,
    vehicleDamageMultiplier: 1.2,
  },
};

const SCAVENGE_RESOURCE_KEYS = new Set(["water", "food", "fuel", "medicine", "parts", "battery"]);

export function normalizeDifficulty(value) {
  return DIFFICULTY_CONFIG[value] ? value : DEFAULT_DIFFICULTY;
}

export function getDifficultyConfig(value) {
  return DIFFICULTY_CONFIG[normalizeDifficulty(value)];
}

export function getDifficultyLabel(value) {
  return getDifficultyConfig(value).label;
}

export function getStartingBonus(value) {
  return { ...getDifficultyConfig(value).startingBonus };
}

export function scaleNightCost(delta, difficulty) {
  if (delta >= 0) return delta;
  const config = getDifficultyConfig(difficulty);
  const cost = Math.abs(delta);
  if (config.consumptionMultiplier < 1) {
    return -Math.max(1, Math.floor(cost * config.consumptionMultiplier));
  }
  if (config.consumptionMultiplier > 1 && cost >= 2) {
    return -Math.ceil(cost * config.consumptionMultiplier);
  }
  return delta;
}

export function adjustEffectDelta(key, value, difficulty, context = {}, scavengeBonusUsed = false) {
  const config = getDifficultyConfig(difficulty);
  let adjusted = value;
  let usedScavengeBonus = scavengeBonusUsed;

  if (key === "infection" && value > 0) {
    adjusted = scaleRiskValue(value, config.infectionMultiplier);
  }

  if (key === "vehicle" && value < 0) {
    adjusted = -scaleRiskValue(Math.abs(value), config.vehicleDamageMultiplier);
  }

  if (key === "noise" && value > 0) {
    adjusted = scaleRiskValue(value, config.riskMultiplier);
  }

  if (
    context.sceneType === "scavenge-screen" &&
    config.scavengeBonus > 0 &&
    !usedScavengeBonus &&
    value > 0 &&
    SCAVENGE_RESOURCE_KEYS.has(key)
  ) {
    adjusted += config.scavengeBonus;
    usedScavengeBonus = true;
  }

  return { value: adjusted, scavengeBonusUsed: usedScavengeBonus };
}

function scaleRiskValue(value, multiplier) {
  if (multiplier === 1) return value;
  return Math.max(1, Math.round(value * multiplier));
}
