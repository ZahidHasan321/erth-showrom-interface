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
  lines: z.string().optional(),
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

  sidePocket: z
    .object({
      phone: z.boolean().optional(),
      wallet: z.boolean().optional(),
    })
    .optional(),

  frontPocket: z
    .object({
      front_pocket_type: z.enum(topPocketTypeValues).optional(),
      front_pocket_thickness: z.enum(thicknessValues).optional(),
      pen_holder: z.boolean().optional(),
    })
    .optional(),
  cuffs: z
    .object({
      cuffs_type: z.enum(cuffTypeValues).optional(),
      cuffs_thickness: z.enum(thicknessValues).optional(),
    })
    .optional(),
});

export type StyleOptionsSchema = z.infer<typeof styleOptionsSchema>;

export const styleOptionsDefaults: StyleOptionsSchema = {
  styleOptionId: "",
  garmentId: "",
  style: "kuwaiti",
  lines: "line1",
  collar: {
    collarType: "JAPANESE COLLAR",
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
    cuffs_type: "CUFF1",
    cuffs_thickness: "SINGLE",
  },
};