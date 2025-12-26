// src/data/characters.ts
export type Position01 = { x: number; y: number };

export type Character = {
  id: string;
  name: string;
  title: string;
  previewUrl: string;
  trueUrl: string;
  parts: { fileName: string; url: string }[];
  // parts の順番と同じ長さが理想（足りない場合は中央(0.5,0.5)扱い）
  correctPositions: Position01[];
};

import c1_preview from "../assets/character1/preview.png";
import c1_true from "../assets/character1/true.png";
import c1_face from "../assets/character1/face.png";
import c1_reb from "../assets/character1/right_eyebrow.png";
import c1_leb from "../assets/character1/left_eyebrow.png";
import c1_re from "../assets/character1/right_eye.png";
import c1_le from "../assets/character1/left_eye.png";
import c1_nose from "../assets/character1/nose.png";
import c1_mouth from "../assets/character1/mouth.png";
import c1_back_hair from "../assets/character1/back_hair.png";
import c1_left_ear from "../assets/character1/left_ear.png";
import c1_right_ear from "../assets/character1/right_ear.png";
import c1_barcode from "../assets/character1/barcode.png";
import c1_front_hair from "../assets/character1/front_hair.png";
import c1_white_hair from "../assets/character1/white_hair.png";

import c2_preview from "../assets/character2/preview.png";
import c2_true from "../assets/character2/true.png";
import c2_face from "../assets/character2/face.png";
import c2_reb from "../assets/character2/right_eyebrow.png";
import c2_leb from "../assets/character2/left_eyebrow.png";
import c2_re from "../assets/character2/right_eye.png";
import c2_le from "../assets/character2/left_eye.png";
import c2_nose from "../assets/character2/nose.png";
import c2_mouth from "../assets/character2/mouth.png";


export const characters: Character[] = [
  {
    id: "character1",
    name: "ぱるすちゃん",
    title: "　",
    previewUrl: c1_preview,
    trueUrl: c1_true,
    parts: [
      { fileName: "back_hair.png", url: c1_back_hair },
      { fileName: "left_ear.png", url: c1_left_ear },
      { fileName: "right_ear.png", url: c1_right_ear },
      { fileName: "face.png", url: c1_face },
      { fileName: "right_eyebrow.png", url: c1_reb },
      { fileName: "left_eyebrow.png", url: c1_leb },
      { fileName: "right_eye.png", url: c1_re },
      { fileName: "left_eye.png", url: c1_le },
      { fileName: "barcode.png", url: c1_barcode },
      { fileName: "nose.png", url: c1_nose },
      { fileName: "mouth.png", url: c1_mouth },
      { fileName: "front_hair.png", url: c1_front_hair },
      { fileName: "white_hair.png", url: c1_white_hair }
    ],
    // 仮の例。あなたの positions.json があるなら、同じ値をここに転記。
    correctPositions: [
      { x: 0.5, y: 0.5 },
      { x: 0.52, y: 0.38 },
      { x: 0.48, y: 0.38 },
      { x: 0.53, y: 0.43 },
      { x: 0.47, y: 0.43 },
      { x: 0.50, y: 0.50 },
      { x: 0.50, y: 0.60 }
    ]
  },
  {
    id: "character2",
    name: "キャラクター2",
    title: "ふくわらい その2",
    previewUrl: c2_preview,
    trueUrl: c2_true,
    parts: [
    { fileName: "face.png", url: c2_face },
      { fileName: "right_eyebrow.png", url: c2_reb },
      { fileName: "left_eyebrow.png", url: c2_leb  },
      { fileName: "right_eye.png", url: c2_re },
      { fileName: "left_eye.png", url: c2_le },
      { fileName: "nose.png", url: c2_nose },
      { fileName: "mouth.png", url: c2_mouth }
    ],
    correctPositions: [
      { x: 0.5, y: 0.5 },
      { x: 0.47, y: 0.45 },
      { x: 0.53, y: 0.45 },
      { x: 0.50, y: 0.52 },
      { x: 0.50, y: 0.62 },
      { x: 0.60, y: 0.35 }
    ]
  }
];
