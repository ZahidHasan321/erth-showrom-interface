import { z } from "zod";

export const customerMeasurementsSchema = z.object({
  measurementType: z.enum(["Body / Dishdasha"]),
  measurementID: z.string(),
  measurementReference: z.enum(["Winter", "Summer", "Eid", "Occasion", "Other"]),
  fabricReferenceNo: z.string(),
  notes: z.string().optional(),
  // Measurements
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
});

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;
