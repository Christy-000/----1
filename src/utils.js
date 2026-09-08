export const IMAGE_ASSETS = new Set([
  "images/scenes/abandoned_gas_station.png",
  "images/scenes/grey_highway.png",
  "images/scenes/infected_raid.png",
  "images/scenes/rv_interior_day.png",
  "images/scenes/rv_interior_night.png",
  "images/scenes/service_area.png",
]);

export const AUDIO_ASSETS = new Set([
  "audio/ambient.mp3",
  "audio/click.mp3",
  "audio/engine.mp3",
  "audio/radio.mp3",
  "audio/rain.mp3",
  "audio/warning.mp3",
]);

const ASSETS = new Set([...IMAGE_ASSETS, ...AUDIO_ASSETS]);

export function resolveAsset(path, fallback = "images/scenes/grey_highway.png") {
  if (path && ASSETS.has(path)) return path;
  if (fallback && ASSETS.has(fallback)) return fallback;
  return fallback || "";
}

export function clampNumber(value, min = 0, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatSigned(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number === 0) return "0";
  return number > 0 ? `+${number}` : `${number}`;
}

export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

export function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function createTimestamp() {
  return new Date().toISOString();
}

export function describeTimestamp(timestamp) {
  if (!timestamp) return "暂无存档";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "存档时间未知";
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function matchesCondition(condition, state) {
  if (!condition) return true;
  if (typeof condition === "function") return Boolean(condition(state));

  return Object.entries(condition).every(([key, expected]) => {
    const actual = key.split(".").reduce((cursor, part) => cursor?.[part], state);
    if (Array.isArray(expected)) return expected.includes(actual);
    if (isPlainObject(expected)) {
      if ("min" in expected && !(actual >= expected.min)) return false;
      if ("max" in expected && !(actual <= expected.max)) return false;
      if ("not" in expected && actual === expected.not) return false;
      return true;
    }
    return actual === expected;
  });
}

export function resolveVisiblePages(scene, state) {
  return (scene.pages || [])
    .filter((page) => (typeof page === "string" ? true : matchesCondition(page.when, state)))
    .map((page) => (typeof page === "string" ? page : page.text));
}

export function resolveVisibleChoices(scene, state) {
  return (scene.choices || []).filter((choice) => matchesCondition(choice.condition, state));
}

export function splitParagraphs(text) {
  return String(text ?? "")
    .split(/\n{2,}|\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
