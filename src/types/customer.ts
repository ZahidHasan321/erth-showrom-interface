export interface Customer {
  id: string;
  createdTime: string;
  fields: {
    Phone: string;
    Name: string;
    NickName?: string;
    CountryCode: string;
    AlternateCountryCode?: string;
    AlternateMobile?: string;
    whatsapp?: boolean;
    Email?: string;
    CustomerType: string;
    Nationality: string;
    InstaID?: string;
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
