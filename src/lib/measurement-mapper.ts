import type { CustomerMeasurementsSchema } from "@/components/forms/customer-measurements/schema";
import type { Measurement } from "@/types/measurement";

export const mapMeasurementToFormValues = (
  measurement: Measurement
): CustomerMeasurementsSchema => {
  return {
    measurementID: measurement.fields.MeasurementID || "",
    measurementType: measurement.fields.MeasurementType || "Body",
    measurementReference: measurement.fields.MeasurementReference || "Other",
    notes: measurement.fields.Notes || "",
    collar: {
      width: measurement.fields.CollarWidth || 0,
      height: measurement.fields.CollarHeight || 0,
    },
    lengths: {
      front: measurement.fields.LengthFront || 0,
      back: measurement.fields.LengthBack || 0,
    },
    arm: {
      shoulder: measurement.fields.Shoulder || 0,
      sleeve: measurement.fields.Sleeve || 0,
      elbow: measurement.fields.Elbow || 0,
      armhole: {
        value: measurement.fields.Armhole || 0,
        front: measurement.fields.ArmholeFront || 0,
        provision: measurement.fields.ArmholeProvision || 0,
      },
    },
    body: {
      upper_chest: measurement.fields.ChestUpper || 0,
      chestHalf: measurement.fields.ChestHalf || 0,
      full_chest: {
        value: measurement.fields.ChestFull || 0,
        front: measurement.fields.ChestFront || 0,
        provision: measurement.fields.ChestProvision || 0,
      },
      full_waist: {
        value: measurement.fields.WaistFull || 0,
        front: measurement.fields.WaistFront || 0,
        back: measurement.fields.WaistBack || 0,
        provision: measurement.fields.WaistProvision || 0,
      },
      bottom: measurement.fields.Bottom || 0,
    },
    topPocket: {
      length: measurement.fields.TopPocketLength || 0,
      width: measurement.fields.TopPocketWidth || 0,
      distance: measurement.fields.TopPocketDistance || 0,
    },
    sidePocket: {
      length: measurement.fields.SidePocketLength || 0,
      width: measurement.fields.SidePocketWidth || 0,
      distance: measurement.fields.SidePocketDistance || 0,
      opening: measurement.fields.SidePocketOpening || 0,
    },
    jabzoor: {
      length: measurement.fields.JabzoorLength || 0,
      width: measurement.fields.JabzoorWidth || 0,
    },
  };
};

export const mapFormValuesToMeasurement = (
  formValues: CustomerMeasurementsSchema,
  customerId: number
): { id?: string; fields: Partial<Measurement["fields"]> } => {
  return {
    fields: {
      CustomerID: customerId,
      MeasurementID: formValues.measurementID,
      MeasurementType: formValues.measurementType,
      MeasurementReference: formValues.measurementReference,
      Notes: formValues.notes,
      CollarWidth: formValues.collar.width,
      CollarHeight: formValues.collar.height,
      LengthFront: formValues.lengths.front,
      LengthBack: formValues.lengths.back,
      Shoulder: formValues.arm.shoulder,
      Sleeve: formValues.arm.sleeve,
      Elbow: formValues.arm.elbow,
      Armhole: formValues.arm.armhole.value,
      ArmholeFront: formValues.arm.armhole.front,
      ArmholeProvision: formValues.arm.armhole.provision,
      ChestUpper: formValues.body.upper_chest,
      ChestFull: formValues.body.full_chest.value,
      ChestFront: formValues.body.full_chest.front,
      ChestProvision: formValues.body.full_chest.provision,
      WaistFull: formValues.body.full_waist.value,
      WaistFront: formValues.body.full_waist.front,
      WaistBack: formValues.body.full_waist.back,
      WaistProvision: formValues.body.full_waist.provision,
      Bottom: formValues.body.bottom,
      TopPocketLength: formValues.topPocket.length,
      TopPocketWidth: formValues.topPocket.width,
      TopPocketDistance: formValues.topPocket.distance,
      SidePocketLength: formValues.sidePocket.length,
      SidePocketWidth: formValues.sidePocket.width,
      SidePocketDistance: formValues.sidePocket.distance,
      SidePocketOpening: formValues.sidePocket.opening,
      JabzoorLength: formValues.jabzoor.length,
      JabzoorWidth: formValues.jabzoor.width,
    },
  };
};
