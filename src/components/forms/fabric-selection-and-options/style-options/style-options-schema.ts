// schema/styleOptionsSchema.ts
import { z } from "zod";
import {
  collarTypes,
  collarButtons,
  jabzourTypes,
  topPocketTypes,
  cuffTypes,
  thicknessOptions,
} from "../constants";

/* ---------- Derive valid string literal arrays ---------- */
const collarTypeValues = collarTypes.map(i => i.value) as [string, ...string[]];
const collarButtonValues = collarButtons.map(i => i.value) as [string, ...string[]];
const jabzourTypeValues = jabzourTypes.map(i => i.value) as [string, ...string[]];
const topPocketTypeValues = topPocketTypes.map(i => i.value) as [string, ...string[]];
const cuffTypeValues = cuffTypes.map(i => i.value) as [string, ...string[]];
const thicknessValues = thicknessOptions.map(i => i.value) as [string, ...string[]];

/* ---------- Schema Definition ---------- */

export const styleOptionsSchema = z.object({
  styleOptionId: z.string().optional(),
  garmentId: z.string().optional(),
  style: z.string().optional(),
  lines: z
    .object({
      line1: z.boolean().optional(),
      line2: z.boolean().optional(),
    })
    .optional(),
  collar: z
    .object({
      collarType: z.enum(collarTypeValues).optional(),
      collarButton: z.enum(collarButtonValues).optional(),
      smallTabaggi: z.boolean().optional(),
    })
    .optional(),

  jabzoor: z
    .object({
      jabzour1: z.enum(jabzourTypeValues).optional(),
      jabzour2: z.enum(jabzourTypeValues).nullable().optional(),
      jabzour_thickness: z.enum(thicknessValues).optional(),
    })
    .optional(),

  frontPocket: z
    .object({
      front_pocket_type: z.enum(topPocketTypeValues).optional(),
      front_pocket_thickness: z.enum(thicknessValues).optional(),
    })
    .optional(),
  accessories: z
    .object({
      phone: z.boolean().optional(),
      wallet: z.boolean().optional(),
      pen_holder: z.boolean().optional(),
    })
    .optional(),
  cuffs: z
    .object({
      hasCuffs: z.boolean().optional(),
      cuffs_type: z.enum(cuffTypeValues).optional(),
      cuffs_thickness: z.enum(thicknessValues).optional(),
    })
    .optional(),

  extraAmount: z.number().optional(),
}).refine(
  (data) => {
    // If jabzour1 is "JAB_SHAAB", jabzour2 must be selected
    if (data.jabzoor?.jabzour1 === "JAB_SHAAB") {
      return data.jabzoor?.jabzour2 !== null && data.jabzoor?.jabzour2 !== undefined;
    }
    return true;
  },
  {
    message: "Jabzour 2 is required when Shaab is selected",
    path: ["jabzoor", "jabzour2"],
  }
);

export type StyleOptionsSchema = z.infer<typeof styleOptionsSchema>;

export const styleOptionsDefaults: StyleOptionsSchema = {
  styleOptionId: "",
  garmentId: "",
  style: "kuwaiti",
  lines: {
    line1: true,
    line2: false,
  },
  collar: {
    collarType: "COL_DOWN_COLLAR",
    collarButton: "COL_TABBAGI",
    smallTabaggi: false,
  },
  jabzoor: {
    jabzour1: "JAB_SHAAB",
    jabzour2: "JAB_BAIN_MURABBA",
    jabzour_thickness: "SINGLE",
  },
  frontPocket: {
    front_pocket_type: "FRO_MURABBA_FRONT_POCKET",
    front_pocket_thickness: "SINGLE",
  },
  accessories: {
    phone: true,
    wallet: false,
    pen_holder: false,
  },
  cuffs: {
    hasCuffs: false,
    cuffs_type: "CUF_NO_CUFF",
    cuffs_thickness: "NO HASHWA",
  },
};