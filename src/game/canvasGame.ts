// src/game/canvasGame.ts (スマホ・ブラウザ対応版)
import type { Character, Position01 } from "../data/characters";

type Timing = {
  SCREEN_TRANSITION: number;
  GAME_START_DELAY: number;
  PART_FADE_OUT: number;
  REVEAL_DURATION_FRAMES: number;
  SCORE_DELAY: number;
  BUTTON_DELAY: number;
};

type LoadedPart = {
  fileName: string;
  image: HTMLImageElement;
  bounds: Bounds;
};

type Bounds = {
  centerX: number;
  centerY: number;
};

type PlacedPart = LoadedPart & {
  x: number;
  y: number;
  opacity: number;
};

export class FukuwaraiGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private fadeOverlay: HTMLDivElement;
  private currentPartNameEl: HTMLDivElement;
  private instructionEl: HTMLDivElement;
  private scoreDisplayEl: HTMLDivElement;
  private retryBtn: HTMLButtonElement;
  private backBtn: HTMLButtonElement;

  private timing: Timing;

  private selected: Character | null = null;
  private parts: LoadedPart[] = [];
  private placed: PlacedPart[] = [];
  private correctPositions: Position01[] = [];

  private currentIndex = 0;

  private mouseX = 0;
  private mouseY = 0;

  private imageScale = 1;

  private revealProgress = 0;
  private isRevealing = false;
  private gameComplete = false;

  private loopStarted = false;
  
  // タッチ操作用フラグ
  private isTouchDevice = false;

  constructor(opts: {
    canvas: HTMLCanvasElement;
    fadeOverlay: HTMLDivElement;
    currentPartNameEl: HTMLDivElement;
    instructionEl: HTMLDivElement;
    scoreDisplayEl: HTMLDivElement;
    retryBtn: HTMLButtonElement;
    backBtn: HTMLButtonElement;
    timing?: Partial<Timing>;
  }) {
    this.canvas = opts.canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context missing");
    this.ctx = ctx;

    this.fadeOverlay = opts.fadeOverlay;
    this.currentPartNameEl = opts.currentPartNameEl;
    this.instructionEl = opts.instructionEl;
    this.scoreDisplayEl = opts.scoreDisplayEl;
    this.retryBtn = opts.retryBtn;
    this.backBtn = opts.backBtn;

    this.timing = {
      SCREEN_TRANSITION: 500,
      GAME_START_DELAY: 800,
      PART_FADE_OUT: 300,
      REVEAL_DURATION_FRAMES: 100,
      SCORE_DELAY: 2000,
      BUTTON_DELAY: 0,
      ...opts.timing
    };

    // タッチデバイスの検出
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    this.bindEvents();
  }

  private bindEvents() {
    // タッチデバイスとマウスデバイスで分岐
    if (this.isTouchDevice) {
      // タッチデバイス用
      this.canvas.addEventListener("touchmove", (e) => {
        this.updatePointerFromEvent(e);
      }, { passive: true });

      this.canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.updatePointerFromEvent(e);
        this.placePart();
      }, { passive: false });
    } else {
      // マウスデバイス用
      this.canvas.addEventListener("mousemove", (e) => {
        this.updatePointerFromEvent(e);
      }, { passive: true });

      this.canvas.addEventListener("click", (e) => {
        e.preventDefault();
        this.placePart();
      });
    }

    window.addEventListener("resize", () => this.onResize());
  }

  private getOpaqueBounds(img: HTMLImageElement, alphaThreshold = 1): Bounds {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;

    const c = off.getContext("2d", { willReadFrequently: true });
    if (!c) return { centerX: w / 2, centerY: h / 2 };

    c.clearRect(0, 0, w, h);
    c.drawImage(img, 0, 0);

    const { data } = c.getImageData(0, 0, w, h);

    let minX = w, minY = h, maxX = -1, maxY = -1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a >= alphaThreshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0 || maxY < 0) return { centerX: w / 2, centerY: h / 2 };

    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }

  private updatePointerFromEvent(e: MouseEvent | TouchEvent) {
    const rect = this.canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    this.mouseX = (clientX - rect.left) * scaleX;
    this.mouseY = (clientY - rect.top) * scaleY;
  }

  async loadCharacter(character: Character, onProgress?: (loaded: number, total: number) => void) {
    this.selected = character;

    const total = character.parts.length + 1;
    let loaded = 0;

    await this.loadImage(character.trueUrl).then(() => {
      loaded++;
      onProgress?.(loaded, total);
    });

    const partImgs: HTMLImageElement[] = [];
    for (const p of character.parts) {
      const img = await this.loadImage(p.url);
      partImgs.push(img);
      loaded++;
      onProgress?.(loaded, total);
    }

    this.parts = character.parts.map((p, i) => ({
      fileName: p.fileName,
      image: partImgs[i],
      bounds: this.getOpaqueBounds(partImgs[i])
    }));

    this.correctPositions = character.correctPositions.slice();
  }

  startPlay() {
    this.resetInternalState();

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.cursor = this.isTouchDevice ? "default" : "none";

    this.calculateImageScale();
    this.updateCurrentPartName();

    this.fadeFromBlack();

    if (!this.loopStarted) {
      this.loopStarted = true;
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  retry() {
    this.resetInternalState();
    this.calculateImageScale();
    this.updateCurrentPartName();
    this.canvas.style.cursor = this.isTouchDevice ? "default" : "none";
    this.fadeFromBlack();
  }

  stopAndResetUI() {
    this.resetInternalState();
    this.scoreDisplayEl.classList.remove("show");
    this.scoreDisplayEl.style.display = "none";
    this.retryBtn.style.display = "none";
    this.backBtn.style.display = "none";
    this.instructionEl.textContent = "クリックでパーツを配置";
    this.currentPartNameEl.textContent = "";
  }

  private resetInternalState() {
    this.currentIndex = 0;
    this.placed = [];
    this.revealProgress = 0;
    this.isRevealing = false;
    this.gameComplete = false;

    this.retryBtn.style.display = "none";
    this.backBtn.style.display = "none";
    this.scoreDisplayEl.classList.remove("show");
    this.scoreDisplayEl.style.display = "none";
    this.instructionEl.textContent = this.isTouchDevice 
      ? "タップでパーツを配置" 
      : "クリックでパーツを配置";
  }

  private fadeFromBlack() {
    this.fadeOverlay.classList.add("no-trans");
    this.fadeOverlay.classList.remove("transparent");
    void this.fadeOverlay.offsetHeight;
    this.fadeOverlay.classList.remove("no-trans");

    requestAnimationFrame(() => {
      this.fadeOverlay.classList.add("transparent");
    });
  }

  private updateCurrentPartName() {
    if (!this.selected) return;
    if (this.currentIndex < this.parts.length) {
      const file = this.parts[this.currentIndex].fileName;
      this.currentPartNameEl.textContent = file.replace(".png", "");
    } else {
      this.currentPartNameEl.textContent = "";
    }
  }

  private placePart() {
    if (!this.selected) return;
    if (this.isRevealing || this.gameComplete) return;
    if (this.currentIndex >= this.parts.length) return;

    const part = this.parts[this.currentIndex];

    const offsetX = (part.bounds.centerX - part.image.width / 2) * this.imageScale;
    const offsetY = (part.bounds.centerY - part.image.height / 2) * this.imageScale;

    this.placed.push({
      ...part,
      x: this.mouseX - offsetX,
      y: this.mouseY - offsetY,
      opacity: 1
    });

    this.currentIndex++;
    this.updateCurrentPartName();

    if (this.currentIndex === this.parts.length) {
      this.currentPartNameEl.textContent = "";
      setTimeout(() => {
        const score = this.calculateScore();
        this.showAllParts(score);
      }, 500);
    }
  }

  private calculateScore() {
    const maxDistance = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2);
    if (!this.placed.length) return 0;

    let totalScore = 0;

    for (let i = 0; i < this.placed.length; i++) {
      const part = this.placed[i];
      const correct = this.correctPositions[i] ?? { x: 0.5, y: 0.5 };
      const correctX = this.canvas.width * correct.x;
      const correctY = this.canvas.height * correct.y;

      const dx = part.x - correctX;
      const dy = part.y - correctY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const partScore = Math.max(0, 100 - (dist / maxDistance) * 200);
      totalScore += partScore;
    }

    return Math.round(totalScore / this.placed.length);
  }

  private showAllParts(score: number) {
    this.isRevealing = true;
    this.revealProgress = 0;
    this.instructionEl.textContent = "完成!";
    this.canvas.style.cursor = "default";

    setTimeout(() => {
      this.scoreDisplayEl.textContent = `スコア: ${score}点`;
      this.scoreDisplayEl.style.display = "block";
      setTimeout(() => this.scoreDisplayEl.classList.add("show"), 50);

      setTimeout(() => {
        this.retryBtn.style.display = "block";
        this.backBtn.style.display = "block";
      }, this.timing.BUTTON_DELAY);
    }, this.timing.SCORE_DELAY);
  }

  private gameLoop() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isRevealing) {
      this.revealProgress += 1 / this.timing.REVEAL_DURATION_FRAMES;
      if (this.revealProgress >= 1) {
        this.revealProgress = 1;
        this.isRevealing = false;
        this.gameComplete = true;
      }
    }

    for (const part of this.placed) {
      const w = part.image.width * this.imageScale;
      const h = part.image.height * this.imageScale;

      if (!this.isRevealing && !this.gameComplete && part.opacity > 0) {
        part.opacity -= (1000 / 60) / this.timing.PART_FADE_OUT;
        if (part.opacity < 0) part.opacity = 0;
      }

      if (this.isRevealing || this.gameComplete) {
        this.ctx.save();
        this.ctx.drawImage(part.image, part.x - w / 2, part.y - h / 2, w, h);
        this.ctx.globalCompositeOperation = "source-atop";
        this.ctx.fillStyle = `rgba(0,0,0,${1 - this.revealProgress})`;
        this.ctx.fillRect(part.x - w / 2, part.y - h / 2, w, h);
        this.ctx.restore();
      } else if (part.opacity > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = part.opacity;
        this.ctx.drawImage(part.image, part.x - w / 2, part.y - h / 2, w, h);
        this.ctx.restore();
      }
    }

    // 未配置パーツの表示
    if (this.currentIndex < this.parts.length && !this.isRevealing && !this.gameComplete) {
      const cur = this.parts[this.currentIndex];
      const w = cur.image.width * this.imageScale;
      const h = cur.image.height * this.imageScale;

      const offsetX = (cur.bounds.centerX - cur.image.width / 2) * this.imageScale;
      const offsetY = (cur.bounds.centerY - cur.image.height / 2) * this.imageScale;

      this.ctx.globalAlpha = 0.8;
      this.ctx.drawImage(cur.image, this.mouseX - w / 2 - offsetX, this.mouseY - h / 2 - offsetY, w, h);
      this.ctx.globalAlpha = 1;

      // タッチデバイスではカーソル点を表示しない
      if (!this.isTouchDevice) {
        this.ctx.fillStyle = "rgba(255,255,255,0.5)";
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  private onResize() {
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    if (!oldW || !oldH) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.calculateImageScale();

    const sx = this.canvas.width / oldW;
    const sy = this.canvas.height / oldH;
    for (const p of this.placed) {
      p.x *= sx;
      p.y *= sy;
    }
  }

  private calculateImageScale() {
    if (!this.parts.length) return;
    const base = this.parts[0].image;
    const maxW = this.canvas.width * 0.6;
    const maxH = this.canvas.height * 0.6;
    this.imageScale = Math.min(maxW / base.width, maxH / base.height);
  }

  private loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }
}