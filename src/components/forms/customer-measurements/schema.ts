import { z } from "zod";

export const customerMeasurementsSchema = z.object({
  measurementType: z.enum(["Body / Dishdasha"]),
  measurementID: z.string().uuid(),
  measurementReference: z.enum(["Winter", "Summer", "Eid", "Occasion", "Other"]),
  fabricReferenceNo: z.string(),
  notes: z.string().optional(),
  // Measurements
  collar: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  shoulder: z.number().positive(),
  armhole: z.number().positive(),
  chest: z.object({
    upper: z.number().positive(),
    half: z.number().positive(),
    full: z.number().positive(),
  }),
  sleeve: z.number().positive(),
  elbow: z.number().positive(),
  topPocket: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    distance: z.number().positive().optional(),
  }),
  sidePocket: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    distance: z.number().positive().optional(),
    opening: z.number().positive().optional(),
  }),
  waist: z.object({
    front: z.number().positive(),
    back: z.number().positive(),
  }),
  length: z.object({
    front: z.number().positive(),
    back: z.number().positive(),
  }),
  bottom: z.number().positive(),
});

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;
