// src/ui/transitions.ts
export function restartFadeIn(el: HTMLElement) {
  el.classList.remove("fade-out");
  el.classList.remove("fade-in");
  // 再トリガー（強制リフロー）
  void el.offsetHeight;
  el.classList.add("fade-in");
}

export function playFadeOut(el: HTMLElement) {
  el.classList.remove("fade-in");
  el.classList.remove("fade-out");
  void el.offsetHeight;
  el.classList.add("fade-out");
}

export function show(el: HTMLElement) {
  el.classList.remove("hidden");
}
export function hide(el: HTMLElement) {
  el.classList.add("hidden");
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
