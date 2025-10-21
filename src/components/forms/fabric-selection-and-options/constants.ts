// constants/styleOptions.ts
import japaneseCollar from "@/assets/collar-assets/collar-types/JAPANES COLLAR.png";
import qalabiCollar from "@/assets/collar-assets/collar-types/QALABI COLLAR.png";
import roundCollar from "@/assets/collar-assets/collar-types/ROUND COLLAR.png";

import multiHoles from "@/assets/collar-assets/collar-buttons/MULTI HOLES.png";
import visibleButtonWithHole from "@/assets/collar-assets/collar-buttons/VISIBLE BUTTON WITH BUTTONHOLE.png";
import visiblePushButton from "@/assets/collar-assets/collar-buttons/VISIBLE PUSH-BUTTON.png";

import smallTabaggiImage from "@/assets/collar-assets/SMALL TABAGGI.png";

import apparent from "@/assets/jabzour-assets/APPARENT.png";
import apparentTriangle from "@/assets/jabzour-assets/APPARENT+TRIANGLE.png";
import hide from "@/assets/jabzour-assets/HIDE.png";
import hideTriangle from "@/assets/jabzour-assets/HIDE+TRIANGLE.png";
import zip from "@/assets/jabzour-assets/ZIP.png";

import circularWithoutThickness from "@/assets/top-pocket-assets/CIRCULAR WITHOUT THICKNESS.png";
import square from "@/assets/top-pocket-assets/SQUARE.png";
import triangle from "@/assets/top-pocket-assets/TRIANGLE.png";
import withCorner from "@/assets/top-pocket-assets/WITH CORNER.png";

import penIcon from "@/assets/Pen.png";
import phoneIcon from "@/assets/Phone.png";
import walletIcon from "@/assets/Wallet.png";

import cuff1Image from "@/assets/sleeves-assets/sleeves-types/TYPE1.png";
import cuff2Image from "@/assets/sleeves-assets/sleeves-types/TYPE2.png";
import cuff3Image from "@/assets/sleeves-assets/sleeves-types/TYPE3.png";
import cuff4Image from "@/assets/sleeves-assets/sleeves-types/TYPE4.png";

/* ---------- Interfaces ---------- */

/** Generic option type with optional price */
export interface BaseOption {
  value: string;
  alt: string;
  displayText: string;
  image: string | null;
  price?: number;
}

/** Thickness type */
export type ThicknessValue = "SINGLE" | "DOUBLE" | "TRIPLE" | "NO HASHWA";
export type ThicknessLabel = "S" | "D" | "T" | "N";

export interface ThicknessOption {
  label: ThicknessLabel;
  value: ThicknessValue;
  className: string;
  price?: number;
}

/* ---------- Constants ---------- */

/** Thickness options */
export const thicknessOptions: ThicknessOption[] = [
  { label: "S", value: "SINGLE", className: "text-green-500" },
  { label: "D", value: "DOUBLE", className: "text-green-500"},
  { label: "T", value: "TRIPLE", className: "text-green-500"},
  { label: "N", value: "NO HASHWA", className: "text-red-500" },
];

/** Collar types */
export const collarTypes: BaseOption[] = [
  { value: "JAPANESE COLLAR", alt: "Japanese Collar", displayText: "Japanese", image: japaneseCollar },
  { value: "QALABI COLLAR", alt: "Qalabi Collar", displayText: "Qalabi", image: qalabiCollar },
  { value: "ROUND COLLAR", alt: "Round Collar", displayText: "Round", image: roundCollar },
];

/** Collar buttons */
export const collarButtons: BaseOption[] = [
  { value: "MULTI HOLES", alt: "Multi Holes", displayText: "Multi Holes", image: multiHoles },
  { value: "VISIBLE BUTTON WITH BUTTONHOLE", alt: "Visible Button with Buttonhole", displayText: "Visible Button", image: visibleButtonWithHole },
  { value: "VISIBLE PUSH-BUTTON", alt: "Visible Push Button", displayText: "Push Button", image: visiblePushButton },
];

/** Jabzour types */
export const jabzourTypes: BaseOption[] = [
  { value: "APPARENT", alt: "Apparent", displayText: "Apparent", image: apparent },
  { value: "APPARENT+TRIANGLE", alt: "Apparent + Triangle", displayText: "Apparent + Triangle", image: apparentTriangle },
  { value: "HIDE", alt: "Hide", displayText: "Hide", image: hide },
  { value: "HIDE+TRIANGLE", alt: "Hide + Triangle", displayText: "Hide + Triangle", image: hideTriangle },
  { value: "ZIP", alt: "Zip", displayText: "Zip", image: zip },
];

/** Top pocket types */
export const topPocketTypes: BaseOption[] = [
  { value: "CIRCULAR WITHOUT THICKNESS", alt: "Circular without thickness", displayText: "Circular without thickness", image: circularWithoutThickness },
  { value: "SQUARE", alt: "Square", displayText: "Square", image: square },
  { value: "TRIANGLE", alt: "Triangle", displayText: "Triangle", image: triangle },
  { value: "WITH CORNER", alt: "With corner", displayText: "With corner", image: withCorner },
];

/** Cuff types (used for sleeves/cuffs) */
export const cuffTypes: BaseOption[] = [
  { value: "CUFF1", alt: "Cuff 1", displayText: "Cuff 1", image: cuff1Image },
  { value: "CUFF2", alt: "Cuff 2", displayText: "Cuff 2", image: cuff2Image },
  { value: "CUFF3", alt: "Cuff 3", displayText: "Cuff 3", image: cuff3Image },
  { value: "CUFF4", alt: "Cuff 4", displayText: "Cuff 4", image: cuff4Image },
];

/** Fabric source & style types */
export const fabricSourceValues = ["In", "Out", ""] as const;
export const styleTypeValues = ["kuwaiti", "designer"] as const;

/** Miscellaneous icons */
export { penIcon, phoneIcon, walletIcon, smallTabaggiImage };