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
    InstaID?: string;
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
    Relation?:string;
  };
}

