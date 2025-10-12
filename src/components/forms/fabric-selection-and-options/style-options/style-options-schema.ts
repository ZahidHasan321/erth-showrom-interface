import { z } from "zod";
import {
  collarTypes,
  collarButtons,
  jabzourTypes,
  jabzourThicknessOptions,
  topPocketTypes,
  sleeveTypes,
} from "../constants";

const collarTypeValues = collarTypes.map((item) => item.value);
const collarButtonValues = collarButtons.map((item) => item.value);
const jabzourTypeValues = jabzourTypes.map((item) => item.value);
const jabzourThicknessShortValues = jabzourThicknessOptions.map(
  (item) => item.label
);
const frontPocketTypeValues = topPocketTypes.map((item) => item.value);
const cuffsTypeValues = sleeveTypes.map((item) => item.value);

export const styleOptionsSchema = z.object({
  styleOptionId: z.string().optional(),
  style: z.string().optional(),
  lines: z.string().optional(),
  collar: z.object({
    collarType: z.enum(collarTypeValues).optional(),
    collarButton: z.enum(collarButtonValues).optional(),
    smallTabaggi: z.boolean().optional(),
  }).optional(),
  jabzoor: z.object({
    jabzour1: z.enum(jabzourTypeValues).optional(),
    jabzour2: z.enum(jabzourTypeValues).optional(),
    jabzour_thickness: z.enum(jabzourThicknessShortValues).optional(),
  }).optional(),
  sidePocket: z.object({
    phone: z.boolean().optional(),
    wallet: z.boolean().optional(),
  }).optional(),
  frontPocket: z.object({
    front_pocket_type: z.enum(frontPocketTypeValues).optional(),
    front_pocket_thickness: z.enum(jabzourThicknessShortValues).optional(),
    pen_holder: z.boolean().optional(),
  }).optional(),
  cuffs: z.object({
    cuffs_type: z.enum(cuffsTypeValues).optional(),
    cuffs_thickness: z.enum(jabzourThicknessShortValues).optional(),
  }).optional(),
});

export type StyleOptionsSchema = z.infer<typeof styleOptionsSchema>;

export const styleOptionsDefaults: StyleOptionsSchema = {
  styleOptionId: "",
  style: "",
  lines: "line1",
  collar: {
    collarType: "JAPANES COLLAR",
    collarButton: "MULTI HOLES",
    smallTabaggi: false,
  },
  jabzoor: {
    jabzour1: "APPARENT",
    jabzour2: "APPARENT",
    jabzour_thickness: "SINGLE",
  },
  sidePocket: {
    phone: false,
    wallet: false,
  },
  frontPocket: {
    front_pocket_type: "SQUARE",
    front_pocket_thickness: "SINGLE",
    pen_holder: false,
  },
  cuffs: {
    cuffs_type: "TYPE1",
    cuffs_thickness: "SINGLE",
  },
};
