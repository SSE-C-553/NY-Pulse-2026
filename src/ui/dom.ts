// src/ui/dom.ts
export function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: #${id}`);
  return el as T;
}

export const dom = {
  selectScreen: () => byId<HTMLDivElement>("selectScreen"),
  titleScreen: () => byId<HTMLDivElement>("titleScreen"),
  gameScreen: () => byId<HTMLDivElement>("gameScreen"),

  characterPreviewImg: () => byId<HTMLImageElement>("previewImage"),
  characterName: () => byId<HTMLDivElement>("characterName"),
  characterTitle: () => byId<HTMLDivElement>("characterTitle"),

  prevBtn: () => byId<HTMLButtonElement>("prevBtn"),
  nextBtn: () => byId<HTMLButtonElement>("nextBtn"),
  selectCharacterBtn: () => byId<HTMLButtonElement>("selectCharacterBtn"),

  trueImage: () => byId<HTMLImageElement>("trueImage"),

  canvas: () => byId<HTMLCanvasElement>("gameCanvas"),
  currentPartName: () => byId<HTMLDivElement>("currentPartName"),
  instruction: () => byId<HTMLDivElement>("instruction"),
  scoreDisplay: () => byId<HTMLDivElement>("scoreDisplay"),
  retryBtn: () => byId<HTMLButtonElement>("retryBtn"),
  backBtn: () => byId<HTMLButtonElement>("backBtn"),

  loadingText: () => byId<HTMLDivElement>("loadingText"),
  loadingText2: () => byId<HTMLDivElement>("loadingText2"),

  fadeOverlay: () => byId<HTMLDivElement>("fadeOverlay")
};
