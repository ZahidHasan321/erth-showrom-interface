import type { Order } from "@/types/order";
import type { OrderSchema } from "@/schemas/work-order-schema";
import { FatouraStage } from "@/types/stages";

export function mapApiOrderToFormOrder(apiOrder: Order): OrderSchema {
  return {
    // Fields from API
    orderID: apiOrder.fields.OrderID,
    fatoura: apiOrder.fields.Fatoura,
    fatouraStages:
      (apiOrder.fields.FatouraStages as FatouraStage) ||
      FatouraStage.FATOURA_RECEIVED,
    customerID: apiOrder.fields.CustomerID,
    orderDate: apiOrder.fields.OrderDate,
    orderStatus: apiOrder.fields.OrderStatus,
    // orderTotal: apiOrder.fields.OrderTotal,
    deliveryDate: apiOrder.fields.DeliveryDate,
    notes: apiOrder.fields.Notes,
    homeDelivery: apiOrder.fields.HomeDelivery ?? false,
    campaigns: apiOrder.fields.Campaigns,
    orderType: (apiOrder.fields.OrderType as any) || "WORK",
    paymentType: (apiOrder.fields.PaymentType as any) || undefined,
    paymentRefNo: apiOrder.fields.PaymentRefNo || undefined,
    orderTaker: apiOrder.fields.OrderTaker?.[0] || undefined,
    discountType: (apiOrder.fields.DiscountType as any) || undefined,
    referralCode: apiOrder.fields.ReferralCode || undefined,
    discountValue: apiOrder.fields.DiscountValue ?? undefined,
    stitchingPrice: apiOrder.fields.StitchingPrice,
    charges: {
      fabric: apiOrder.fields.FabricCharge ?? 0,
      stitching: apiOrder.fields.StitchingCharge ?? 0,
      style: apiOrder.fields.StyleCharge ?? 0,
      delivery: apiOrder.fields.DeliveryCharge ?? 0,
      shelf: apiOrder.fields.ShelfCharge ?? 0,
    },
    advance: apiOrder.fields.Advance ?? undefined,
    paid: apiOrder.fields.Paid ?? 0,
    balance: apiOrder.fields.Balance ?? 0,
    numOfFabrics: apiOrder.fields.NumOfFabrics ?? 0,
  };
}

export function mapFormOrderToApiOrder(
  formOrder: Partial<OrderSchema>,
  orderId?: string,
): { id?: string; fields: Partial<Order["fields"]> } {
  // Build fields object and filter out undefined values to avoid overwriting existing data
  const fields: Partial<Order["fields"]> = {};

  // Only include fields that are actually provided
  if (formOrder.customerID !== undefined)
    fields.CustomerID = formOrder.customerID;
  if (formOrder.customerID !== undefined)
    fields.DeliveryDate = formOrder.deliveryDate;
  if (formOrder.orderDate !== undefined) fields.OrderDate = formOrder.orderDate;
  if (formOrder.orderStatus !== undefined)
    fields.OrderStatus = formOrder.orderStatus;
  if (formOrder.orderType === "WORK" && formOrder.fatouraStages !== undefined) {
    fields.FatouraStages = formOrder.fatouraStages;
  }
  if (formOrder.homeDelivery !== undefined)
    fields.HomeDelivery = formOrder.homeDelivery;
  if (formOrder.notes !== undefined) fields.Notes = formOrder.notes;
  if (formOrder.campaigns !== undefined) fields.Campaigns = formOrder.campaigns;
  if (formOrder.orderType !== undefined) fields.OrderType = formOrder.orderType;
  if (formOrder.paymentType !== undefined)
    fields.PaymentType = formOrder.paymentType;
  if (formOrder.paymentRefNo !== undefined)
    fields.PaymentRefNo = formOrder.paymentRefNo;
  if (formOrder.orderTaker !== undefined)
    fields.OrderTaker = [formOrder.orderTaker];
  if (formOrder.discountType !== undefined)
    fields.DiscountType = formOrder.discountType;
  if (formOrder.referralCode !== undefined)
    fields.ReferralCode = formOrder.referralCode;
  if (formOrder.discountValue !== undefined)
    fields.DiscountValue = formOrder.discountValue;
  if (formOrder.stitchingPrice !== undefined)
    fields.StitchingPrice = formOrder.stitchingPrice;

  // Handle charges object
  if (formOrder.charges?.fabric !== undefined)
    fields.FabricCharge = formOrder.charges.fabric;
  if (formOrder.charges?.stitching !== undefined)
    fields.StitchingCharge = formOrder.charges.stitching;
  if (formOrder.charges?.style !== undefined)
    fields.StyleCharge = formOrder.charges.style;
  if (formOrder.charges?.delivery !== undefined)
    fields.DeliveryCharge = formOrder.charges.delivery;
  if (formOrder.charges?.shelf !== undefined)
    fields.ShelfCharge = formOrder.charges.shelf;

  if (formOrder.advance !== undefined) fields.Advance = formOrder.advance;
  if (formOrder.paid !== undefined) fields.Paid = formOrder.paid;
  if (formOrder.balance !== undefined) fields.Balance = formOrder.balance;
  if (formOrder.numOfFabrics !== undefined)
    fields.NumOfFabrics = formOrder.numOfFabrics;

  const apiOrder: { id?: string; fields: Partial<Order["fields"]> } = {
    fields,
  };

  if (orderId) {
    apiOrder.id = orderId;
  }
  return apiOrder;
}
