import { createTimestamp } from "./utils.js";

export const SAVE_KEY = "after-grey-tide.v4.save";

export function autoSave({ currentSceneId, pageIndex, state }) {
  try {
    const payload = {
      currentSceneId,
      pageIndex,
      state,
      log: state?.log || [],
      timestamp: createTimestamp(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return payload;
  } catch {
    return null;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasSave() {
  return Boolean(loadGame());
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // localStorage may be unavailable in strict browser modes.
  }
}
