import { z } from "zod";

export const customerMeasurementsDefaults: CustomerMeasurementsSchema = {
  measurementID: "",
  measurementType: "Body",
  measurementReference: "", // fallback
  measurementOtherNote: "",
  measurer: "",
  measurementDate: new Date(), // Default to today for new measurements
  notes: "",
  collar: {
    width: undefined,
    height: undefined,
  },
  lengths: {
    front: undefined,
    back: undefined,
  },
  arm: {
    shoulder: undefined,
    sleeveLength: undefined,
    sleeveWidth: undefined,
    elbow: undefined,
    armhole: {
      value: undefined,
      front: undefined,
      provision: undefined,
    },
  },
  body: {
    upper_chest: undefined,
    back_chest: undefined,
    full_chest: {
      value: undefined,
      front: undefined,
      provision: undefined,
    },
    full_waist: {
      value: undefined,
      front: undefined,
      back: undefined,
      provision: undefined,
    },
    bottom: undefined,
  },
  topPocket: {
    length: undefined,
    width: undefined,
    distance: undefined,
  },
  sidePocket: {
    length: undefined,
    width: undefined,
    distance: undefined,
    opening: undefined,
  },
  jabzoor: {
    length: undefined,
    width: undefined,
  },
};

export const customerMeasurementsSchema = z.object({
  measurementRecord: z.string().optional(),
  measurementID: z.string(),
  measurementType: z.enum(["Body", "Dishdasha"]),
  measurementReference: z.string().min(1, "Reference is required"),
  measurementOtherNote: z.string().optional(),
  measurer: z.string().optional(),
  measurementDate: z.date().optional(),
  notes: z.string().optional(),
  collar: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  lengths: z.object({
    front: z.number().optional(),
    back: z.number().optional(),
  }),
  arm: z.object({
    shoulder: z.number().optional(),
    sleeveLength: z.number().optional(),
    sleeveWidth: z.number().optional(),
    elbow: z.number().optional(),
    armhole: z.object({
      value: z.number().optional(),
      front: z.number().optional(),
      provision: z.number().optional(),
    }),
  }),
  body: z.object({
    upper_chest: z.number().optional(),
    full_chest: z.object({
      value: z.number().optional(),
      front: z.number().optional(),
      provision: z.number().optional(),
    }),
    full_waist: z.object({
      value: z.number().optional(),
      front: z.number().optional(),
      back: z.number().optional(),
      provision: z.number().optional(),
    }),
    back_chest: z.number().optional(),
    bottom: z.number().optional(),
  }),
  topPocket: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    distance: z.number().optional(),
  }),
  sidePocket: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    distance: z.number().optional(),
    opening: z.number().optional(),
  }),
  jabzoor: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
  }),
})
  .refine(
    (data) => {
      // During submission, ensure all required numeric fields are defined
      const requiredFields = [
        { value: data.collar.width, name: "Collar width" },
        { value: data.collar.height, name: "Collar height" },
        { value: data.lengths.front, name: "Front length" },
        { value: data.lengths.back, name: "Back length" },
        { value: data.arm.shoulder, name: "Shoulder" },
        { value: data.arm.sleeveLength, name: "Sleeve length" },
        { value: data.arm.sleeveWidth, name: "Sleeve width" },
        { value: data.arm.elbow, name: "Elbow" },
        { value: data.arm.armhole.value, name: "Armhole value" },
        { value: data.arm.armhole.front, name: "Armhole front" },
        { value: data.body.upper_chest, name: "Upper chest" },
        { value: data.body.full_chest.value, name: "Full chest value" },
        { value: data.body.full_chest.front, name: "Full chest front" },
        { value: data.body.full_waist.value, name: "Full waist value" },
        { value: data.body.full_waist.front, name: "Full waist front" },
        { value: data.body.full_waist.back, name: "Full waist back" },
        { value: data.body.back_chest, name: "Back chest" },
        { value: data.body.bottom, name: "Bottom" },
        { value: data.topPocket.length, name: "Top pocket length" },
        { value: data.topPocket.width, name: "Top pocket width" },
        { value: data.topPocket.distance, name: "Top pocket distance" },
        { value: data.sidePocket.length, name: "Side pocket length" },
        { value: data.sidePocket.width, name: "Side pocket width" },
        { value: data.sidePocket.distance, name: "Side pocket distance" },
        { value: data.sidePocket.opening, name: "Side pocket opening" },
        { value: data.jabzoor.length, name: "Jabzoor length" },
        { value: data.jabzoor.width, name: "Jabzoor width" },
      ];

      const missingFields = requiredFields.filter(
        (field) => field.value === undefined || field.value === null || field.value < 1
      );

      return missingFields.length === 0;
    },
    {
      message: "All measurement fields must be filled with valid values (greater than 0) before submission",
    }
  );

export type CustomerMeasurementsSchema = z.infer<typeof customerMeasurementsSchema>;