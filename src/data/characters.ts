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
import c2_2026 from "../assets/character2/2026.png";
import c2_back from "../assets/character2/back.png";
import c2_mikan from "../assets/character2/mikan.png";
import c2_parusu from "../assets/character2/parusu.png";
import c2_yoroshiku from "../assets/character2/yoroshiku.png";

import c3_preview from "../assets/character3/preview.png";
import c3_true from "../assets/character3/true.png";
import c3_0 from "../assets/character3/0_coat_back.png";
import c3_1 from "../assets/character3/1_code.png";
import c3_2 from "../assets/character3/2_back_hair.png";
import c3_3 from "../assets/character3/3_code.png";
import c3_4 from "../assets/character3/4_right_leg.png";
import c3_5 from "../assets/character3/5_left_leg.png";
import c3_6 from "../assets/character3/6_right_arm.png";
import c3_7 from "../assets/character3/7_left_arm.png";
import c3_8 from "../assets/character3/8_body.png";
import c3_9 from "../assets/character3/9_code.png";
import c3_10 from "../assets/character3/10_ring.png";
import c3_11 from "../assets/character3/11_scart.png";
import c3_12 from "../assets/character3/12_jacket.png";
import c3_13 from "../assets/character3/13_face.png";
import c3_14 from "../assets/character3/14_right_eye.png";
import c3_15 from "../assets/character3/15_left_eye.png";
import c3_16 from "../assets/character3/16_left_eyebrow.png";
import c3_17 from "../assets/character3/17_right_eyebrow.png";
import c3_18 from "../assets/character3/18_nose_and_mouth.png";
import c3_19 from "../assets/character3/19_front_hair.png";
import c3_20 from "../assets/character3/20_white_hair.png";

export const characters: Character[] = [
  {
    id: "character1",
    name: "ぱるすちゃん（ノーマル・13パーツ）",
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
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.50, y: 0.50 },
      { x: 0.50, y: 0.60 }
    ]
  },
  {
    id: "character2",
    name: "ぱるすちゃん（かんたん・5パーツ）",
    title: " ",
    previewUrl: c2_preview,
    trueUrl: c2_true,
    parts: [
      { fileName: "back.png", url: c2_back },
      { fileName: "parusu.png", url: c2_parusu },
      { fileName: "2026.png", url: c2_2026 },
      { fileName: "yoroshiku.png", url: c2_yoroshiku },
      { fileName: "mikan.png", url: c2_mikan },
    ],
    correctPositions: [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 }
    ]
  },
  {
    id: "character3",
    name: "ぱるすちゃん（激ムズ・21パーツ）",
    title: "　",
    previewUrl: c3_preview,
    trueUrl: c3_true,
    parts: [
      { fileName: "0_coat_back.png", url: c3_0 },
      { fileName: "1_code.png", url: c3_1 },
      { fileName: "2_back_hair.png", url: c3_2 },
      { fileName: "3_code.png", url: c3_3 },
      { fileName: "4_right_leg.png", url: c3_4 },
      { fileName: "5_left_leg.png", url: c3_5 },
      { fileName: "6_right_arm.png", url: c3_6 },
      { fileName: "7_left_arm.png", url: c3_7 },
      { fileName: "8_body.png", url: c3_8 },
      { fileName: "9_code.png", url: c3_9 },
      { fileName: "10_ring.png", url: c3_10 },
      { fileName: "11_scart.png", url: c3_11 },
      { fileName: "12_jacket.png", url: c3_12 },
      { fileName: "13_face.png", url: c3_13 },
      { fileName: "14_right_eye.png", url: c3_14 },
      { fileName: "15_left_eye.png", url: c3_15 },
      { fileName: "16_left_eyebrow.png", url: c3_16 },
      { fileName: "17_right_eyebrow.png", url: c3_17 },
      { fileName: "18_nose_and_mouth.png", url: c3_18 },
      { fileName: "19_front_hair.png", url: c3_19 },
      { fileName: "20_white_hair.png", url: c3_20 },
    ],
    correctPositions: [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 }
    ]
  }
];