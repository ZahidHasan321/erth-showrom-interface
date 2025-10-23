export interface Order {
  id: string;
  createdTime?: string;
  fields: {
    OrderID?: string;
    CustomerID?: string[];
    OrderDate?: string;
    OrderStatus: "Pending" | "Completed" | "Cancelled" | "Processing";
    OrderTotal?: number;
    Notes?: string;
    Campaigns?: string[];
    PaymentType?: "k-net" | "cash" | "link-payment" | "installments" | "others";

    OrderType?: "pickUp" | "homeDelivery";
    DiscountType?: "flat" | "referral" | "loyalty";
    ReferralCode?: string;
    DiscountValue?: number;

    FabricCharge?: number;
    StitchingCharge?: number;
    StyleCharge?: number;
    DeliveryCharge?: number;
    ShelfCharge?: number;

    Advance?: number;
    Balance?: number;
    NumOfFabrics?: number;
  };
}
