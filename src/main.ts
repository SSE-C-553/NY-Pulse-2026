import "./styles.css";
import { characters } from "./data/characters";
import { dom } from "./ui/dom";
import { hide, show, restartFadeIn, playFadeOut, sleep } from "./ui/transitions";
import { FukuwaraiGame } from "./game/canvasGame";

const TIMING = {
  SCREEN_TRANSITION: 500,
  GAME_START_DELAY: 800
} as const;

const selectScreen = dom.selectScreen();
const titleScreen = dom.titleScreen();
const gameScreen = dom.gameScreen();

const previewImage = dom.characterPreviewImg();
const characterName = dom.characterName();
const characterTitle = dom.characterTitle();
const trueImage = dom.trueImage();

const prevBtn = dom.prevBtn();
const nextBtn = dom.nextBtn();
const selectBtn = dom.selectCharacterBtn();

const loadingText = dom.loadingText();
const loadingText2 = dom.loadingText2();

const game = new FukuwaraiGame({
  canvas: dom.canvas(),
  fadeOverlay: dom.fadeOverlay(),
  currentPartNameEl: dom.currentPartName(),
  instructionEl: dom.instruction(),
  scoreDisplayEl: dom.scoreDisplay(),
  retryBtn: dom.retryBtn(),
  backBtn: dom.backBtn()
});

let currentCharacterIndex = 0;

type Dir = "left" | "right" | "none";
let dir: Dir = "none";

function updateCharacterPreviewAnimated(direction: Dir) {
  const c = characters[currentCharacterIndex];

  // クラス全消し
  previewImage.classList.remove(
    "slide-in-left","slide-in-right","slide-out-left","slide-out-right"
  );

  // OUT
  if (direction === "left") previewImage.classList.add("slide-out-right");
  if (direction === "right") previewImage.classList.add("slide-out-left");

  const swap = () => {
    previewImage.classList.remove("slide-out-left","slide-out-right");

    // 画像差し替え
    previewImage.src = c.previewUrl;
    characterName.textContent = c.name;

    // IN（再トリガー用）
    void previewImage.offsetHeight;
    if (direction === "left") previewImage.classList.add("slide-in-left");
    if (direction === "right") previewImage.classList.add("slide-in-right");
  };

  if (direction === "none") {
    // 初期表示は即反映でOK
    previewImage.src = c.previewUrl;
    characterName.textContent = c.name;
    return;
  }

  // OUT終了後にswap（animationendの方が堅い）
  const onEnd = () => {
    previewImage.removeEventListener("animationend", onEnd);
    swap();
  };
  previewImage.addEventListener("animationend", onEnd);
}

function updateCharacterPreview() {
  const c = characters[currentCharacterIndex];
  previewImage.src = c.previewUrl;
  characterName.textContent = c.name;
}
updateCharacterPreview();
restartFadeIn(selectScreen);

prevBtn.addEventListener("click", () => {
  currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
  updateCharacterPreviewAnimated("left");
});

nextBtn.addEventListener("click", () => {
  currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
  updateCharacterPreviewAnimated("right");
});


selectBtn.addEventListener("click", async () => {
  const c = characters[currentCharacterIndex];

  playFadeOut(selectScreen);
  await sleep(TIMING.SCREEN_TRANSITION);
  hide(selectScreen);

  show(titleScreen);
  restartFadeIn(titleScreen);

  characterTitle.textContent = c.title;
  trueImage.src = c.trueUrl;

  loadingText.textContent = "";
  loadingText2.textContent = "画像読み込み中...";

  await game.loadCharacter(c, (loaded, total) => {
    loadingText2.textContent = `画像読み込み中... ${loaded}/${total}`;
  });

  loadingText2.textContent = "読み込み完了！まもなく開始...";
  await sleep(TIMING.GAME_START_DELAY);

  playFadeOut(titleScreen);
  await sleep(TIMING.SCREEN_TRANSITION);
  hide(titleScreen);

  show(gameScreen);
  // gameScreen は常に表示（overlayで暗転管理）
  game.startPlay();
});

dom.retryBtn().addEventListener("click", () => {
  game.retry();
});

dom.backBtn().addEventListener("click", () => {
  hide(gameScreen);
  game.stopAndResetUI();

  show(selectScreen);
  restartFadeIn(selectScreen);
});
