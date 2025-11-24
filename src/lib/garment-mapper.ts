import type { Garment } from "@/types/garment";
import type { FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import type { StyleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import { PieceStage } from "@/types/stages";

export function mapApiGarmentToFormGarment(apiGarment: Garment): { fabricSelection: FabricSelectionSchema, styleOptions: StyleOptionsSchema } {
  const fields = apiGarment.fields;
  const fabricSelection: FabricSelectionSchema = {
    id: apiGarment.id,
    orderId: fields.OrderId || [],
    fatoura: fields.Fatoura,
    garmentId: fields.GarmentId || "",
    pieceStage: fields.PieceStages as PieceStage || PieceStage.WAITING_CUT,
    brova: fields.Brova ?? false,
    fabricSource: fields.FabricSource,
    fabricId: fields.FabricId?.at(0) || "",
    shopName: fields.ShopName || "",
    fabricLength: fields.FabricLength || "",
    ifInside: "",
    color: fields.Color || "",
    measurementId: fields.MeasurementId.at(0) || "",
    express: fields.Express ?? false,
    deliveryDate: fields.DeliveryDate ? new Date(fields.DeliveryDate) : null,
    note: fields.Note || "",
    fabricAmount: 0,
    homeDelivery: fields.HomeDelivery ?? false,
  };

  // Convert API lines string to form boolean structure
  const linesValue = fields.Lines || "1";
  const linesObject = {
    line1: linesValue === "1",
    line2: linesValue === "2",
  };

  const styleOptions: StyleOptionsSchema = {
    styleOptionId: fields.StyleOptionId || "",
    garmentId: fields.GarmentId || "",
    style: fields.Style || "kuwaiti",
    lines: linesObject,
    collar: {
      collarType: fields.CollarType,
      collarButton: fields.CollarButton,
      smallTabaggi: fields.SmallTabaggi,
    },
    jabzoor: {
      jabzour1: fields.Jabzour1,
      jabzour2: fields.Jabzour2,
      jabzour_thickness: fields.JabzourThickness,
    },
    frontPocket: {
      front_pocket_type: fields.FrontPocketType,
      front_pocket_thickness: fields.FrontPocketThickness,
    },
    accessories: {
      phone: fields.Phone,
      wallet: fields.Wallet,
      pen_holder: fields.PenHolder,
    },
    cuffs: {
      cuffs_type: fields.CuffsType,
      cuffs_thickness: fields.CuffsThickness,
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
      OrderId: fabricSelection.orderId,
      Fatoura: fabricSelection.fatoura,
      GarmentId: fabricSelection.garmentId,
      PieceStages: fabricSelection.pieceStage,
      Brova: fabricSelection.brova,
      FabricSource: fabricSelection.fabricSource,
      FabricId: fabricSelection.fabricId ? [fabricSelection.fabricId] : [],
      ShopName: fabricSelection.shopName,
      FabricLength: fabricSelection.fabricLength,
      Color: fabricSelection.color,
      MeasurementId: [measurementRecordId], // Use converted record ID
      Express: fabricSelection.express,
      DeliveryDate: fabricSelection.deliveryDate?.toISOString(),
      Note: fabricSelection.note,
      HomeDelivery: fabricSelection.homeDelivery,

      // from styleOptions (flattened)
      StyleOptionId: styleOptions.styleOptionId,
      Style: styleOptions.style,
      Lines: styleOptions.lines?.line2
        ? "2"
        : "1",
      CollarType: styleOptions.collar?.collarType,
      CollarButton: styleOptions.collar?.collarButton,
      SmallTabaggi: styleOptions.collar?.smallTabaggi,
      Jabzour1: styleOptions.jabzoor?.jabzour1,
      Jabzour2: styleOptions.jabzoor?.jabzour2 || undefined,
      JabzourThickness: styleOptions.jabzoor?.jabzour_thickness,
      FrontPocketType: styleOptions.frontPocket?.front_pocket_type,
      FrontPocketThickness: styleOptions.frontPocket?.front_pocket_thickness,
      Phone: styleOptions.accessories?.phone,
      Wallet: styleOptions.accessories?.wallet,
      PenHolder: styleOptions.accessories?.pen_holder,
      CuffsType: styleOptions.cuffs?.cuffs_type,
      CuffsThickness: styleOptions.cuffs?.cuffs_thickness,
    },
  };
  if (garmentId) {
    apiGarment.id = garmentId;
  }
  return apiGarment;
}
