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
    AlternateMobile?: number;
    Whatsapp?: boolean;
    Email?: string;
    CustomerType?: string | Array<{ id: string; name: string; }>;
    Nationality: string;
    InstaID?: number;
    Governorate?: string;
    Floor?: string;
    Block?: string;
    AptNo?: string;
    Street?: string;
    Landmark?: string;
    HouseNo?: string;
    DOB?: string; // Assuming date will be sent as a string
  };
}

export interface UpsertResponseData<T> {
  updatedRecords: string[];
  createdRecords: string[];
  records: T[];
}