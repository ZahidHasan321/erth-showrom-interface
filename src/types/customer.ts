export interface Customer {
  id: string;
  createdTime: string;
  fields: {
    id?: number;
    Phone: string;
    Name: string;
    NickName?: string;
    CountryCode: string;
    AlternateCountryCode?: string;
    AlternateMobile?: string;
    Whatsapp?: boolean;
    Email?: string;
    Nationality: string;
    InstaID?: number;
    WhatsappAlt?: boolean;
    City?: string;
    Block?: string;
    Street?: string;
    HouseNo?: string;
    Area?: string;
    AddressNote?: string;
    DOB?: string;
    AccountType?: string;
    CustomerSegment?: string;
    Note?: string;
  };
}

export interface UpsertResponseData<T> {
  updatedRecords: string[];
  createdRecords: string[];
  records: T[];
}

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
    ChestUpper?: number;
    ChestHalf?: number;
    ChestFull?: number;
    Sleeve?: number;
    Elbow?: number;
    TopPocketLength?: number;
    TopPocketWidth?: number;
    TopPocketDistance?: number;
    SidePocketLength?: number;
    SidePocketWidth?: number;
    SidePocketDistance?: number;
    SidePocketOpening?: number;
    WaistFront?: number;
    WaistBack?: number;
    LengthFront?: number;
    LengthBack?: number;
    Bottom?: number;
  };
}