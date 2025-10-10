import { z } from "zod";

export const customerMeasurementsDefaults: CustomerMeasurementsSchema = {
  measurementID: "",
  measurementType: "Body",
  measurementReference: "Other", // fallback
  fabricReferenceNo: [],
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
  measurementID: z.string(),
  measurementType: z.enum(["Body", "Dishdasha"]),
  measurementReference: z.enum(["Winter", "Summer", "Eid", "Occasion", "Other"]),
  fabricReferenceNo: z.array(z.string()).optional(),
  notes: z.string().optional(),
  collar: z.object({
    width: z.number().positive("InValid Collar Width"),
    height: z.number().positive("InValid Collar Height"),
  }),
  lengths: z.object({
    front: z.number().positive("InValid Length Front"),
    back: z.number().positive("InValid Length Back"),
  }),
  arm: z.object({
    shoulder: z.number().positive("InValid Shoulder"),
    sleeve: z.number().positive("InValid Sleeve"),
    elbow: z.number().positive("InValid Elbow"),
    armhole: z.object({
      value: z.number().positive("InValid Armhole"),
      front: z.number().positive("InValid Armhole Front"),
      provision: z.number().optional(),
    }),
  }),
  body: z.object({
    upper_chest: z.number().positive("InValid Chest Upper"),
    full_chest: z.object({
      value: z.number().positive("InValid Chest Full"),
      front: z.number().positive("InValid Chest Full Front"),
      provision: z.number().optional(),
    }),
    full_waist: z.object({
      value: z.number().positive("InValid Waist"),
      front: z.number().positive("InValid Waist Front"),
      back: z.number().positive("InValid Waist Back"),
      provision: z.number().optional(),
    }),
    bottom: z.number().positive("InValid Bottom"),
  }),
  topPocket: z.object({
    length: z.number().positive("InValid Top Pocket Length"),
    width: z.number().positive("InValid Top Pocket Width"),
    distance: z.number().positive("InValid Top Pocket Distance").optional(),
  }),
  sidePocket: z.object({
    length: z.number().positive("InValid Side Pocket Length"),
    width: z.number().positive("InValid Side Pocket Width"),
    distance: z.number().positive("InValid Side Pocket Distance").optional(),
    opening: z.number().positive("InValid Side Pocket Opening").optional(),
  }),
  jabzoor: z.object({
    length: z.number().positive("InValid Jabzoor Length"),
    width: z.number().positive("InValid Jabzoor Width"),
  }),
});

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;

