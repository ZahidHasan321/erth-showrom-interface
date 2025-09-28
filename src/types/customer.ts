export interface Customer {
  id: string;
  createdTime: string;
  fields: {
    PHONE: string;
    NAME: string;
    ORDERS?: string[];
    ID: number;
    "ID GARMENT"?: string[];
    "1 ST LETTER": string;
    "ID MEAS"?: string[];
    "NBRE OF PIECES": number;
    "NBRE OF PIECES copy"?: string[];
    "NBRE OF FATOURA": number;
  };
}
