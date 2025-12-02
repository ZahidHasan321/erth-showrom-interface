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

  // Transform Jabzour fields from backend to frontend
  // Backend ZIPPER → Frontend JAB_SHAAB in jabzour1, jabzour2 stays as is
  // Backend BUTTON → Frontend shows jabzour2 value in jabzour1, jabzour2 is cleared
  let frontendJabzour1 = fields.Jabzour1;
  let frontendJabzour2 = fields.Jabzour2;

  if (fields.Jabzour1 === "ZIPPER") {
    frontendJabzour1 = "JAB_SHAAB";
    // jabzour2 stays as is from backend
  } else if (fields.Jabzour1 === "BUTTON") {
    // Move jabzour2 to jabzour1, clear jabzour2
    frontendJabzour1 = fields.Jabzour2;
    frontendJabzour2 = undefined;
  }

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
      jabzour1: frontendJabzour1,
      jabzour2: frontendJabzour2,
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

  // Transform Jabzour fields from frontend to backend
  // Frontend JAB_SHAAB in jabzour1 → Backend ZIPPER in jabzour1, jabzour2 as selected
  // Frontend non-JAB_SHAAB in jabzour1 → Backend BUTTON in jabzour1, jabzour1 value goes to jabzour2
  let backendJabzour1 = styleOptions.jabzoor?.jabzour1;
  let backendJabzour2 = styleOptions.jabzoor?.jabzour2;

  if (styleOptions.jabzoor?.jabzour1 === "JAB_SHAAB") {
    backendJabzour1 = "ZIPPER";
    // jabzour2 stays as is (user's actual selection)
  } else if (styleOptions.jabzoor?.jabzour1 && styleOptions.jabzoor?.jabzour1 !== "JAB_SHAAB") {
    // Non-JAB_SHAAB value in jabzour1
    backendJabzour1 = "BUTTON";
    backendJabzour2 = styleOptions.jabzoor.jabzour1; // Move jabzour1 value to jabzour2
  }

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
      Jabzour1: backendJabzour1,
      Jabzour2: backendJabzour2 || undefined,
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
