
import type { CustomerMeasurementsSchema } from "@/components/forms/customer-measurements/schema";
import type { Measurement } from "@/types/customer";

export const mapMeasurementToFormValues = (measurement: Measurement): CustomerMeasurementsSchema => {
    return {
        measurementID: measurement.fields.MeasurementID || '',
        measurementType: measurement.fields.MeasurementType || 'Body',
        measurementReference: measurement.fields.MeasurementReference || 'Other',
        fabricReferenceNo: measurement.fields.FabricReferenceNo || [],
        notes: measurement.fields.Notes || '',
        collar: {
            width: measurement.fields.CollarWidth || 0,
            height: measurement.fields.CollarHeight || 0,
        },
        shoulder: measurement.fields.Shoulder || 0,
        armhole: measurement.fields.Armhole || 0,
        chest: {
            upper: measurement.fields.ChestUpper || 0,
            half: measurement.fields.ChestHalf || 0,
            full: measurement.fields.ChestFull || 0,
        },
        sleeve: measurement.fields.Sleeve || 0,
        elbow: measurement.fields.Elbow || 0,
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
        waist: {
            front: measurement.fields.WaistFront || 0,
            back: measurement.fields.WaistBack || 0,
        },
        length: {
            front: measurement.fields.LengthFront || 0,
            back: measurement.fields.LengthBack || 0,
        },
        bottom: measurement.fields.Bottom || 0,
    };
};

export const mapFormValuesToMeasurement = (formValues: CustomerMeasurementsSchema, customerId: number): { id?: string; fields: Partial<Measurement['fields']> } => {
    return {
        fields: {
            CustomerID: customerId,
            MeasurementID: formValues.measurementID,
            MeasurementType: formValues.measurementType,
            MeasurementReference: formValues.measurementReference,
            FabricReferenceNo: formValues.fabricReferenceNo,
            Notes: formValues.notes,
            CollarWidth: formValues.collar.width,
            CollarHeight: formValues.collar.height,
            Shoulder: formValues.shoulder,
            Armhole: formValues.armhole,
            ChestUpper: formValues.chest.upper,
            ChestHalf: formValues.chest.half,
            ChestFull: formValues.chest.full,
            Sleeve: formValues.sleeve,
            Elbow: formValues.elbow,
            TopPocketLength: formValues.topPocket.length,
            TopPocketWidth: formValues.topPocket.width,
            TopPocketDistance: formValues.topPocket.distance,
            SidePocketLength: formValues.sidePocket.length,
            SidePocketWidth: formValues.sidePocket.width,
            SidePocketDistance: formValues.sidePocket.distance,
            SidePocketOpening: formValues.sidePocket.opening,
            WaistFront: formValues.waist.front,
            WaistBack: formValues.waist.back,
            LengthFront: formValues.length.front,
            LengthBack: formValues.length.back,
            Bottom: formValues.bottom,
        }
    };
};
