import { FatouraStage } from './stages';

export interface Order {
  id: string;
  createdTime?: string;
  fields: {
    OrderID?: string;
    Fatoura?: number;
    FatouraStages?: FatouraStage;
    CustomerID?: string[];
    OrderDate?: string;
    OrderStatus: "Pending" | "Completed" | "Cancelled";
    Notes?: string;
    Campaigns?: string[];
    PaymentType?: "k-net" | "cash" | "link-payment" | "installments" | "others";
    PaymentRefNo?: string;
    OrderTaker?: string[];
    HomeDelivery?: boolean;
    OrderType?: "work" | "sales";
    DiscountType?: "flat" | "referral" | "loyalty" | "byValue";
    ReferralCode?: string;
    DiscountValue?: number;
    FabricCharge?: number;
    StitchingCharge?: number;
    StyleCharge?: number;
    DeliveryCharge?: number;
    ShelfCharge?: number;
    Advance?: number;
    Paid?: number;
    Balance?: number;
    NumOfFabrics?: number;
  };
}
