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
  shoulder: 0,
  armhole: 0,
  chest: {
    upper: 0,
    half: 0,
    full: 0,
  },
  sleeve: 0,
  elbow: 0,
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
  waist: {
    front: 0,
    back: 0,
  },
  length: {
    front: 0,
    back: 0,
  },
  bottom: 0,
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
    width: z.number("Invalid number").positive("InValid Collar Width"),
    height: z.number("Invalid number").positive("InValid Collar Height"),
  }),
  shoulder: z.number("Invalid number").positive("InValid Shoulder"),
  armhole: z.number("Invalid number").positive("InValid Armhole"),
  chest: z.object({
    upper: z.number("Invalid number").positive("InValid Chest Upper"),
    half: z.number("Invalid number").positive("InValid Chest Half"),
    full: z.number("Invalid number").positive("InValid Chest Full"),
  }),
  sleeve: z.number("Invalid number").positive("InValid Sleeve"),
  elbow: z.number("Invalid number").positive("InValid Elbow"),
  topPocket: z.object({
    length: z.number("Invalid number").positive("InValid Top Pocket Length"),
    width: z.number("Invalid number").positive("InValid Top Pocket Width"),
    distance: z.number("Invalid number").positive("InValid Top Pocket Distance").optional(),
  }),
  sidePocket: z.object({
    length: z.number("Invalid number").positive("InValid Side Pocket Length"),
    width: z.number("Invalid number").positive("InValid Side Pocket Width"),
    distance: z.number("Invalid number").positive("InValid Side Pocket Distance").optional(),
    opening: z.number("Invalid number").positive("InValid Side Pocket Opening").optional(),
  }),
  waist: z.object({
    front: z.number("Invalid number").positive("InValid Waist Front"),
    back: z.number("Invalid number").positive("InValid Waist Back"),
  }),
  length: z.object({
    front: z.number("Invalid number").positive("InValid Length Front"),
    back: z.number("Invalid number").positive("InValid Length Back"),
  }),
  bottom: z.number("Invalid number").positive("InValid Bottom"),
  jabzoor: z.object({
    length: z.number("Invalid number").positive("InValid Jabzoor Length"),
    width: z.number("Invalid number").positive("InValid Jabzoor Width"),
  }),
});

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;

