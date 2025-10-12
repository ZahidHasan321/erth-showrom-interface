import { z } from "zod";

export const customerMeasurementsDefaults: CustomerMeasurementsSchema = {
  measurementID: "",
  measurementType: "Body",
  measurementReference: "Other", // fallback
  notes: "",
  collar: {
    width: 0,
    height: 0,
  },
  lengths: {
    front: 0,
    back: 0,
  },
  arm: {
    shoulder: 0,
    sleeve: 0,
    elbow: 0,
    armhole: {
      value: 0,
      front: 0,
      provision: 0,
    },
  },
  body: {
    upper_chest: 0,
    chestHalf: 0,
    full_chest: {
      value: 0,
      front: 0,
      provision: 0,
    },
    full_waist: {
      value: 0,
      front: 0,
      back: 0,
      provision: 0,
    },
    bottom: 0,
  },
  topPocket: {
    length: 0,
    width: 0,
    distance: 0,
  },
  sidePocket: {
    length: 0,
    width: 0,
    distance: 0,
    opening: 0,
  },
  jabzoor: {
    length: 0,
    width: 0,
  },
};

export const customerMeasurementsSchema = z.object({
  measurementID: z.string(),
  measurementType: z.enum(["Body", "Dishdasha"]),
  measurementReference: z.enum(["Winter", "Summer", "Eid", "Occasion", "Other"]),
  notes: z.string().optional(),
  collar: z.object({
    width: z.number().min(0, "Value cannot be negative"),
    height: z.number().min(0, "Value cannot be negative"),
  }),
  lengths: z.object({
    front: z.number().min(0, "Value cannot be negative"),
    back: z.number().min(0, "Value cannot be negative"),
  }),
  arm: z.object({
    shoulder: z.number().min(0, "Value cannot be negative"),
    sleeve: z.number().min(0, "Value cannot be negative"),
    elbow: z.number().min(0, "Value cannot be negative"),
    armhole: z.object({
      value: z.number().min(0, "Value cannot be negative"),
      front: z.number().min(0, "Value cannot be negative"),
      provision: z.number().optional(),
    }),
  }),
  body: z.object({
    upper_chest: z.number().min(0, "Value cannot be negative"),
    chestHalf: z.number().min(0, "Value cannot be negative"),
    full_chest: z.object({
      value: z.number().min(0, "Value cannot be negative"),
      front: z.number().min(0, "Value cannot be negative"),
      provision: z.number().optional(),
    }),
    full_waist: z.object({
      value: z.number().min(0, "Value cannot be negative"),
      front: z.number().min(0, "Value cannot be negative"),
      back: z.number().min(0, "Value cannot be negative"),
      provision: z.number().optional(),
    }),
    bottom: z.number().min(0, "Value cannot be negative"),
  }),
  topPocket: z.object({
    length: z.number().min(0, "Value cannot be negative"),
    width: z.number().min(0, "Value cannot be negative"),
    distance: z.number().min(0, "Value cannot be negative").optional(),
  }),
  sidePocket: z.object({
    length: z.number().min(0, "Value cannot be negative"),
    width: z.number().min(0, "Value cannot be negative"),
    distance: z.number().min(0, "Value cannot be negative").optional(),
    opening: z.number().min(0, "Value cannot be negative").optional(),
  }),
  jabzoor: z.object({
    length: z.number().min(0, "Value cannot be negative"),
    width: z.number().min(0, "Value cannot be negative"),
  }),
});

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;

