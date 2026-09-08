import { resolveAsset } from "./utils.js";

const SOUND_KEY = "after-grey-tide.v4.sound";

export class AudioController {
  constructor() {
    this.enabled = readSoundSetting();
    this.unlocked = false;
    this.currentAmbient = null;
    this.currentAmbientPath = "";
    this.cache = new Map();
  }

  init() {
    const unlock = () => this.unlock();
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(value) {
    this.enabled = Boolean(value);
    localStorage.setItem(SOUND_KEY, this.enabled ? "on" : "off");
    if (!this.enabled) this.stopAmbient();
  }

  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    if (!this.enabled) return;
    const click = this.getAudio("audio/click.mp3");
    if (!click) return;
    click.volume = 0;
    const playPromise = click.play();
    if (playPromise) {
      playPromise
        .then(() => {
          click.pause();
          click.currentTime = 0;
          click.volume = 0.45;
        })
        .catch(() => {});
    }
  }

  playClick() {
    this.play("audio/click.mp3", 0.42);
  }

  playWarning() {
    this.play("audio/warning.mp3", 0.5);
  }

  playScene(scene) {
    const path = scene?.ambience || scene?.music || "";
    if (!path) {
      this.stopAmbient();
      return;
    }
    this.playAmbient(path);
  }

  playAmbient(path) {
    if (!this.enabled || !this.unlocked) return;
    const resolved = resolveAsset(path, "");
    if (!resolved || this.currentAmbientPath === resolved) return;

    this.stopAmbient();
    const audio = this.getAudio(resolved);
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.22;
    this.currentAmbient = audio;
    this.currentAmbientPath = resolved;
    audio.play().catch(() => {});
  }

  stopAmbient() {
    if (!this.currentAmbient) return;
    this.currentAmbient.pause();
    this.currentAmbient.currentTime = 0;
    this.currentAmbient = null;
    this.currentAmbientPath = "";
  }

  play(path, volume = 0.5) {
    if (!this.enabled || !this.unlocked) return;
    const audio = this.getAudio(path);
    if (!audio) return;
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  getAudio(path) {
    if (typeof Audio === "undefined") return null;
    const resolved = resolveAsset(path, "");
    if (!resolved) return null;
    if (!this.cache.has(resolved)) {
      const audio = new Audio(resolved);
      audio.preload = "auto";
      audio.addEventListener("error", () => {});
      this.cache.set(resolved, audio);
    }
    return this.cache.get(resolved);
  }
}

function readSoundSetting() {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}
