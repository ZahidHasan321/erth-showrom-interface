export interface PriceItemFields {
  name: string;
  price: number;
  type: string;
}

export interface PriceItem {
  id: string;
  createdTime: string;
  fields: PriceItemFields;
}