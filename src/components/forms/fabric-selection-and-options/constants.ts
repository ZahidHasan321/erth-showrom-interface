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
import sleeveType1 from "@/assets/sleeves-assets/sleeves-types/TYPE1.png";
import sleeveType2 from "@/assets/sleeves-assets/sleeves-types/TYPE2.png";
import sleeveType3 from "@/assets/sleeves-assets/sleeves-types/TYPE3.png";
import sleeveType4 from "@/assets/sleeves-assets/sleeves-types/TYPE4.png";

export const topPocketTypes = [
  {
    value: "CIRCULAR WITHOUT THICKNESS",
    alt: "Circular without thickness",
    displayText: "Circular without thickness",
    image: circularWithoutThickness,
  },
  {
    value: "SQUARE",
    alt: "Square",
    displayText: "Square",
    image: square,
  },
  {
    value: "TRIANGLE",
    alt: "Triangle",
    displayText: "Triangle",
    image: triangle,
  },
  {
    value: "WITH CORNER",
    alt: "With corner",
    displayText: "With corner",
    image: withCorner,
  },
];

export const sleeveTypes = [
  {
    value: "TYPE1",
    alt: "Type 1",
    displayText: "Type 1",
    image: sleeveType1,
  },
  {
    value: "TYPE2",
    alt: "Type 2",
    displayText: "Type 2",
    image: sleeveType2,
  },
  {
    value: "TYPE3",
    alt: "Type 3",
    displayText: "Type 3",
    image: sleeveType3,
  },
  {
    value: "TYPE4",
    alt: "Type 4",
    displayText: "Type 4",
    image: sleeveType4,
  },
];

export const jabzourTypes = [
  {
    value: "APPARENT",
    alt: "Apparent",
    displayText: "Apparent",
    image: apparent,
  },
  {
    value: "APPARENT+TRIANGLE",
    alt: "Apparent + Triangle",
    displayText: "Apparent + Triangle",
    image: apparentTriangle,
  },
  {
    value: "HIDE",
    alt: "Hide",
    displayText: "Hide",
    image: hide,
  },
  {
    value: "HIDE+TRIANGLE",
    alt: "Hide + Triangle",
    displayText: "Hide + Triangle",
    image: hideTriangle,
  },
  {
    value: "ZIP",
    alt: "Zip",
    displayText: "Zip",
    image: zip,
  },
];

export const jabzourThicknessOptions = [
  { label: "S", value: "SINGLE", className: "bg-green-500" },
  { label: "D", value: "DOUBLE", className: "bg-green-500" },
  { label: "N", value: "NO HASHWA", className: "text-red-500" },
  { label: "T", value: "TRIPLE", className: "text-green-500" },
];

export const collarTypes = [
  {
    value: "JAPANES COLLAR",
    alt: "Japanese Collar",
    displayText: "Japanese",
    image: japaneseCollar,
  },
  {
    value: "QALABI COLLAR",
    alt: "Qalabi Collar",
    displayText: "Qalabi",
    image: qalabiCollar,
  },
  {
    value: "ROUND COLLAR",
    alt: "Round Collar",
    displayText: "Round",
    image: roundCollar,
  },
];

export const collarButtons = [
  {
    value: "MULTI HOLES",
    alt: "Multi Holes",
    displayText: "Multi Holes",
    image: multiHoles,
  },
  {
    value: "VISIBLE BUTTON WITH BUTTONHOLE",
    alt: "Visible Button with Buttonhole",
    displayText: "Visible Button",
    image: visibleButtonWithHole,
  },
  {
    value: "VISIBLE PUSH-BUTTON",
    alt: "Visible Push Button",
    displayText: "Push Button",
    image: visiblePushButton,
  },
];

export { penIcon, phoneIcon, walletIcon, smallTabaggiImage };
