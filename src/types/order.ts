export interface Order {
  id: string;
  fields: {
    OrderID?: string;
    CustomerID?: string[];
    OrderDate?: string;
    OrderStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    OrderTotal?: number;
    Notes?: string;
  };
}
