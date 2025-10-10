export interface Measurement {
  id?: string; // Airtable record ID
  createdTime?: string;
  fields: {
    CustomerID: number; // Link to Customer record
    MeasurementType: "Body" | "Dishdasha";
    MeasurementID: string;
    MeasurementReference: "Winter" | "Summer" | "Eid" | "Occasion" | "Other";
    FabricReferenceNo?: string[];
    Notes?: string;
    CollarWidth?: number;
    CollarHeight?: number;
    Shoulder?: number;
    Armhole?: number;
    ArmholeFront?: number;
    ArmholeProvision?: number;
    ChestUpper?: number;
    ChestHalf?: number;
    ChestFull?: number;
    ChestFront?: number;
    ChestProvision?: number;
    Sleeve?: number;
    Elbow?: number;
    TopPocketLength?: number;
    TopPocketWidth?: number;
    TopPocketDistance?: number;
    SidePocketLength?: number;
    SidePocketWidth?: number;
    SidePocketDistance?: number;
    SidePocketOpening?: number;
    WaistFull?: number;
    WaistFront?: number;
    WaistBack?: number;
    WaistProvision?: number;
    LengthFront?: number;
    LengthBack?: number;
    Bottom?: number;
    JabzoorLength?: number;
    JabzoorWidth?: number;
  };
}