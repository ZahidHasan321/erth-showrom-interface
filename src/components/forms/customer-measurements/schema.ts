import { z } from "zod";

export const customerMeasurementsDefaults: CustomerMeasurementsSchema = {
  measurementID: "",
  measurementType: "Body",
  measurementReference: "Other", // fallback
  measurer: "",
  measurementDate: new Date(),
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
  measurementRecord: z.string().optional(),
  measurementID: z.string(),
  measurementType: z.enum(["Body", "Dishdasha"]),
  measurementReference: z.enum(["Winter", "Summer", "Eid", "Occasion", "Other"]),
  measurer: z.string().optional(),
  measurementDate: z.date().optional(),
  notes: z.string().optional(),
  collar: z.object({
    width: z.number().min(1, "Width is required"),
    height: z.number().min(1, "Height is required"),
  }),
  lengths: z.object({
    front: z.number().min(1, "Front length is required"),
    back: z.number().min(1, "Back length is required"),
  }),
  arm: z.object({
    shoulder: z.number().min(1, "Shoulder is required"),
    sleeve: z.number().min(1, "Sleeve is required"),
    elbow: z.number().min(1, "Elbow is required"),
    armhole: z.object({
      value: z.number().min(1, "Armhole value is required"),
      front: z.number().min(1, "Armhole front is required"),
      provision: z.number().optional(),
    }),
  }),
  body: z.object({
    upper_chest: z.number().min(1, "Upper chest is required"),
    full_chest: z.object({
      value: z.number().min(1, "Full chest value is required"),
      front: z.number().min(1, "Full chest front is required"),
      provision: z.number().optional(),
    }),
    full_waist: z.object({
      value: z.number().min(1, "Full waist value is required"),
      front: z.number().min(1, "Full waist front is required"),
      back: z.number().min(1, "Full waist back is required"),
      provision: z.number().optional(),
    }),
    bottom: z.number().min(1, "Bottom is required"),
  }),
  topPocket: z.object({
    length: z.number().min(1, "Top pocket length is required"),
    width: z.number().min(1, "Top pocket width is required"),
    distance: z.number().min(1, "Top pocket distance is required"),
  }),
  sidePocket: z.object({
    length: z.number().min(1, "Side pocket length is required"),
    width: z.number().min(1, "Side pocket width is required"),
    distance: z.number().min(1, "Side pocket distance is required"),
    opening: z.number().min(1, "Side pocket opening is required"),
  }),
  jabzoor: z.object({
    length: z.number().min(1, "Jabzoor length is required"),
    width: z.number().min(1, "Jabzoor width is required"),
  }),
});

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;