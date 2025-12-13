export interface Measurement {
  id?: string; // Airtable record ID
  createdTime?: string;
  fields: {
    CustomerID: [string]; // Link to Customer record
    MeasurementType: "Body" | "Dishdasha";
    MeasurementID: string;
    MeasurementReference: string;
    ReferenceOtherNote?: string;
    Measurer?: string[];
    MeasurementDate?: string; // ISO date string
    Notes?: string;
    CollarWidth?: number;
    CollarHeight?: number;
    Shoulder?: number;
    Armhole?: number;
    ArmholeFront?: number;
    ArmholeProvision?: number;
    ChestUpper?: number;
    ChestFull?: number;
    ChestBack?:number;
    ChestFront?: number;
    ChestProvision?: number;
    SleeveLength?: number;
    SleeveWidth?: number;
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

