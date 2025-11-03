export interface StyleFields {
  Code: string;
  Name: string;
  Type: string;
  // Stitch: string;
  // Rate: number;
  RatePerItem: number;
}

export interface Style {
  id: string;
  createdTime: string;
  fields: StyleFields;
}
