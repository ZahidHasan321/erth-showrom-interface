import type { Garment } from "@/types/garment";
import type { FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import type { StyleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";

export function mapApiGarmentToFormGarment(apiGarment: Garment): { fabricSelection: FabricSelectionSchema, styleOptions: StyleOptionsSchema } {
  const fields = apiGarment.fields;
  const fabricSelection: FabricSelectionSchema = {
    id: apiGarment.id,
    orderId: fields.orderId || [],
    garmentId: fields.garmentId || "",
    brova: fields.brova || false,
    fabricSource: fields.fabricSource,
    fabricId: fields.fabricId?.at(0) || "",
    fabricLength: fields.fabricLength || "",
    // ifInside: fields.ifInside || "",
    color: fields.color || "",
    measurementId: fields.measurementId.at(0) || "",
    express: fields.express || false,
    deliveryDate: fields.deliveryDate ? new Date(fields.deliveryDate) : null,
    note: fields.note || "",
  };

  const styleOptions: StyleOptionsSchema = {
    styleOptionId: fields.styleOptionId || "",
    garmentId: fields.garmentId || "",
    style: fields.style || "kuwaiti",
    lines: fields.lines || "line1",
    collar: {
      collarType: fields.collarType,
      collarButton: fields.collarButton,
      smallTabaggi: fields.smallTabaggi,
    },
    jabzoor: {
      jabzour1: fields.jabzour1,
      jabzour2: fields.jabzour2,
      jabzour_thickness: fields.jabzour_thickness,
    },
    sidePocket: {
      phone: fields.phone,
      wallet: fields.wallet,
    },
    frontPocket: {
      front_pocket_type: fields.front_pocket_type,
      front_pocket_thickness: fields.front_pocket_thickness,
      pen_holder: fields.pen_holder,
    },
    cuffs: {
      cuffs_type: fields.cuffs_type,
      cuffs_thickness: fields.cuffs_thickness,
    },
  };

  return { fabricSelection, styleOptions };
}

export function mapFormGarmentToApiGarment(
  fabricSelection: FabricSelectionSchema,
  styleOptions: StyleOptionsSchema,
  measurementIdMap?: Map<string, string>,
  garmentId?: string
): { id?: string; fields: Partial<Garment["fields"]> } {
  // Convert measurementId (display value like "44-1") to record ID if map is provided
  const measurementRecordId = measurementIdMap?.get(fabricSelection.measurementId) || fabricSelection.measurementId;
  
  const apiGarment: { id?: string; fields: Partial<Garment["fields"]> } = {
    fields: {
      // from fabricSelection
      orderId: fabricSelection.orderId,
      garmentId: fabricSelection.garmentId,
      brova: fabricSelection.brova,
      fabricSource: fabricSelection.fabricSource,
      fabricId: [fabricSelection.fabricId],
      fabricLength: fabricSelection.fabricLength,
      color: fabricSelection.color,
      measurementId: [measurementRecordId], // Use converted record ID
      express: fabricSelection.express,
      deliveryDate: fabricSelection.deliveryDate?.toISOString(),
      note: fabricSelection.note,

      // from styleOptions (flattened)
      styleOptionId: styleOptions.styleOptionId,
      style: styleOptions.style,
      lines: styleOptions.lines,
      collarType: styleOptions.collar?.collarType,
      collarButton: styleOptions.collar?.collarButton,
      smallTabaggi: styleOptions.collar?.smallTabaggi,
      jabzour1: styleOptions.jabzoor?.jabzour1,
      jabzour2: styleOptions.jabzoor?.jabzour2 || undefined,
      jabzour_thickness: styleOptions.jabzoor?.jabzour_thickness,
      phone: styleOptions.sidePocket?.phone,
      wallet: styleOptions.sidePocket?.wallet,
      front_pocket_type: styleOptions.frontPocket?.front_pocket_type,
      front_pocket_thickness: styleOptions.frontPocket?.front_pocket_thickness,
      pen_holder: styleOptions.frontPocket?.pen_holder,
      cuffs_type: styleOptions.cuffs?.cuffs_type,
      cuffs_thickness: styleOptions.cuffs?.cuffs_thickness,
    },
  };
  if (garmentId) {
    apiGarment.id = garmentId;
  }
  return apiGarment;
}
