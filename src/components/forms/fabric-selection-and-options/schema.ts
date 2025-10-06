import { z } from "zod";
import {
  collarTypes,
  collarButtons,
  jabzourTypes,
  topPocketTypes,
  sleeveTypes,
  jabzourThicknessOptions,
  fabricSourceValues,
  styleTypeValues,
} from "./constants";

const collarTypeValues = collarTypes.map((item) => item.value);
const collarButtonValues = collarButtons.map((item) => item.value);
const jabzourTypeValues = jabzourTypes.map((item) => item.value);
const topPocketTypeValues = topPocketTypes.map((item) => item.value);
const sleeveTypeValues = sleeveTypes.map((item) => item.value);
const jabzourThicknessShortValues = jabzourThicknessOptions.map(
  (item) => item.label
);

export const fabricSelectionSchema = z.object({
  id: z.string(),
  garmentDetails: z.object({
    garmentId: z.string().min(1, "Garment ID is required"),
    brova: z.boolean(),
  }),
  fabricDetails: z.object({
    fabricSource: z.enum(fabricSourceValues),
    fabricCode: z.string().min(1, "Fabric is required"),
    fabricLength: z.string().min(1, "Length is required"),
  }),
  measurementId: z.string().min(1, "Measurement ID is required"),
  customize: z.boolean(),
  style: z.object({
    styleOptionId: z.string(),
    style: z.enum(styleTypeValues),
    lines: z.object({
      line1: z.boolean(),
      line2: z.boolean(),
    }),
    collar: z.object({
      collarType: z.enum(collarTypeValues),
      collarButton: z.enum(collarButtonValues),
      smallTabaggi: z.boolean(),
    }),
    jabzour: z.object({
      jabzour1: z.enum(jabzourTypeValues),
      jabzour2: z.enum(jabzourTypeValues),
      jabzour_thickness: z.enum(jabzourThicknessShortValues),
    }),
    topPocket: z.object({
      top_pocket_type: z.enum(topPocketTypeValues),
      top_pocket_thickness: z.enum(jabzourThicknessShortValues),
      pen_holder: z.boolean(),
    }),
    sidePocket: z.object({
      side_pocket_phone: z.boolean(),
      side_pocket_wallet: z.boolean(),
    }),
    sleeves: z.object({
      sleeves_type: z.enum(sleeveTypeValues),
      sleeves_thickness: z.enum(jabzourThicknessShortValues),
    }),
  }),
  total_amount: z.number().positive(),
  special_request: z.string().optional(),
});

export type FabricSelectionSchema = z.infer<typeof fabricSelectionSchema>;

export const fabricSelectionDefaults: FabricSelectionSchema = {
  id: "",
  garmentDetails: {
    garmentId: "",
    brova: false,
  },
  fabricDetails: {
    fabricSource: "",
    fabricCode: "",
    fabricLength: "",
  },
  measurementId: "",
  customize: false,
  style: {
    styleOptionId: "",
    style: "",
    lines: {
      line1: false,
      line2: false,
    },
    collar: {
      collarType: "JAPANES COLLAR",
      collarButton: "MULTI HOLES",
      smallTabaggi: false,
    },
    jabzour: {
      jabzour1: "APPARENT",
      jabzour2: "APPARENT",
      jabzour_thickness: "",
    },
    topPocket: {
      top_pocket_type: "SQUARE",
      top_pocket_thickness: "",
      pen_holder: false,
    },
    sidePocket: {
      side_pocket_phone: false,
      side_pocket_wallet: false,
    },
    sleeves: {
      sleeves_type: "TYPE1",
      sleeves_thickness: "",
    },
  },
  total_amount: 0,
  special_request: "",
};
