import * as React from "react";
import ErthLogo from "@/assets/erth-light.svg";
import type { FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import type { StyleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import type { OrderSchema } from "@/schemas/work-order-schema";
import type { ShelvesFormValues } from "@/components/forms/shelved-products/schema";
import type { Fabric } from "@/types/fabric";
import type { Style } from "@/types/style";

export interface InvoiceData {
  // Order Info
  orderId?: string;
  orderDate?: string;
  orderType?: "pickUp" | "homeDelivery";
  orderStatus?: string;

  // Customer Info
  customerName?: string;
  customerPhone?: string;
  customerAddress?: {
    city?: string;
    area?: string;
    block?: string;
    street?: string;
    houseNumber?: string;
  };

  // Items
  fabricSelections?: FabricSelectionSchema[];
  styleOptions?: StyleOptionsSchema[];
  shelvedProducts?: ShelvesFormValues["products"];

  // Reference data for mapping IDs to names
  fabrics?: Fabric[];
  styles?: Style[];

  // Charges
  charges?: OrderSchema["charges"];
  discountType?: string;
  discountValue?: number;
  discountPercentage?: number;
  advance?: number;

  // Payment
  paymentType?: string;
  otherPaymentType?: string;
  paymentRefNo?: string;
  orderTaker?: string;
}

export interface OrderInvoiceProps {
  data: InvoiceData;
}

export const OrderInvoice = React.forwardRef<HTMLDivElement, OrderInvoiceProps>(
  ({ data }, ref) => {
    const {
      orderId,
      orderDate,
      orderType,
      orderStatus,
      customerName,
      customerPhone,
      customerAddress,
      fabricSelections = [],
      styleOptions = [],
      shelvedProducts = [],
      fabrics = [],
      styles = [],
      charges,
      discountType,
      discountValue = 0,
      discountPercentage = 0,
      advance = 0,
      paymentType,
      otherPaymentType,
      paymentRefNo,
      orderTaker,
    } = data;

    // Helper functions to get names from IDs
    const getFabricName = (fabricId?: string) => {
      if (!fabricId) return null;
      const fabric = fabrics.find((f) => f.id === fabricId);
      return fabric?.fields.Name;
    };

    const getStyleName = (garmentId?: string) => {
      if (!garmentId) return null;
      const style = styles.find((s) => s.id === garmentId);
      return style?.fields.Name;
    };

    // Calculate totals
    const totalDue = charges
      ? Object.values(charges).reduce((acc, val) => acc + (val || 0), 0)
      : 0;
    const finalAmount = totalDue - discountValue;
    const balance = finalAmount - advance;

    // Format date
    const formattedDate = orderDate
      ? new Date(orderDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    // Format address
    const addressString = customerAddress
      ? [
          customerAddress.houseNumber,
          customerAddress.street,
          customerAddress.block,
          customerAddress.area,
          customerAddress.city,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    // Format payment type
    const getPaymentTypeLabel = () => {
      if (paymentType === "others") return otherPaymentType || "Others";
      if (paymentType === "k-net") return "K-Net";
      if (paymentType === "cash") return "Cash";
      if (paymentType === "link-payment") return "Link Payment";
      if (paymentType === "installments") return "Installments";
      return paymentType;
    };

    return (
      <div ref={ref} className="bg-white text-black p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
          <div>
            <img src={ErthLogo} alt="ERTH Showroom" className="h-16 mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">ERTH Showroom</h1>
            <p className="text-sm text-gray-600">Custom Tailoring & Garments</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h2>
            {orderId && (
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>
            )}
            {formattedDate && (
              <p className="text-sm text-gray-600">Date: {formattedDate}</p>
            )}
            {orderStatus && (
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    orderStatus === "Completed"
                      ? "text-green-600"
                      : orderStatus === "Cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {orderStatus}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {customerName && (
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{customerName}</p>
              </div>
            )}
            {customerPhone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{customerPhone}</p>
              </div>
            )}
            {addressString && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold">{addressString}</p>
              </div>
            )}
            {orderType && (
              <div>
                <p className="text-sm text-gray-600">Delivery Type</p>
                <p className="font-semibold">
                  {orderType === "homeDelivery" ? "Home Delivery" : "Pick Up"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        {(fabricSelections.length > 0 || shelvedProducts.length > 0) && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
              Order Items
            </h3>

            {/* Fabric Selections */}
            {fabricSelections.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Fabric Selections
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">Fabric</th>
                      <th className="text-left py-2">Color</th>
                      <th className="text-left py-2">Length</th>
                      <th className="text-left py-2">Style</th>
                      <th className="text-right py-2">Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fabricSelections.map((fabric, idx) => {
                      const fabricName = getFabricName(fabric.fabricId);
                      const styleName = getStyleName(fabric.garmentId);
                      const styleOption = styleOptions[idx];
                      const hasNote = fabric.note && fabric.note.trim() !== "";

                      return (
                        <React.Fragment key={fabric.id}>
                          <tr className="border-b border-gray-200">
                            <td className="py-2">{idx + 1}</td>
                            <td className="py-2">
                              {fabric.fabricSource === "In"
                                ? fabricName || "N/A"
                                : fabric.shopName || "Outside Fabric"}
                            </td>
                            <td className="py-2">{fabric.color || "N/A"}</td>
                            <td className="py-2">
                              {fabric.fabricLength ? `${fabric.fabricLength}m` : "N/A"}
                            </td>
                            <td className="py-2">{styleName || "N/A"}</td>
                            <td className="py-2 text-right">
                              {fabric.express
                                ? "Express"
                                : fabric.homeDelivery
                                  ? "Home"
                                  : "Standard"}
                            </td>
                          </tr>
                          {(hasNote || styleOption) && (
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <td></td>
                              <td colSpan={5} className="py-2 text-xs text-gray-600">
                                {hasNote && (
                                  <div>
                                    <strong>Note:</strong> {fabric.note}
                                  </div>
                                )}
                                {styleOption?.collar && (
                                  <div>
                                    <strong>Collar:</strong> {styleOption.collar.collarType} -{" "}
                                    {styleOption.collar.collarButton}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Shelved Products */}
            {shelvedProducts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Shelved Products
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Size</th>
                      <th className="text-right py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shelvedProducts.map((product, idx) => (
                      <tr key={product.id} className="border-b border-gray-200">
                        <td className="py-2">{idx + 1}</td>
                        <td className="py-2">{product.productType || product.brand || "N/A"}</td>
                        <td className="py-2">{product.serialNumber || "N/A"}</td>
                        <td className="py-2 text-right">
                          {product.unitPrice ? `${product.unitPrice} KWD` : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Charges Summary */}
        {charges && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
              Charges Summary
            </h3>
            <div className="space-y-2 text-sm">
              {charges.fabric > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fabric Charges</span>
                  <span className="font-semibold">{charges.fabric.toFixed(2)} KWD</span>
                </div>
              )}
              {charges.stitching > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Stitching Charges</span>
                  <span className="font-semibold">{charges.stitching.toFixed(2)} KWD</span>
                </div>
              )}
              {charges.style > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Style Charges</span>
                  <span className="font-semibold">{charges.style.toFixed(2)} KWD</span>
                </div>
              )}
              {charges.delivery > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-semibold">{charges.delivery.toFixed(2)} KWD</span>
                </div>
              )}
              {charges.shelf > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shelved Products</span>
                  <span className="font-semibold">{charges.shelf.toFixed(2)} KWD</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300 font-semibold">
                <span>Total Due</span>
                <span>{totalDue.toFixed(2)} KWD</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>
                    Discount
                    {discountType === "flat" && discountPercentage > 0
                      ? ` (${discountPercentage}%)`
                      : discountType
                        ? ` (${discountType})`
                        : ""}
                  </span>
                  <span className="font-semibold">- {discountValue.toFixed(2)} KWD</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Advance Paid</span>
                <span className="font-semibold">
                  {(balance < 0 ? advance + balance : advance).toFixed(2)} KWD
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 text-lg font-bold">
                <span>Balance</span>
                <span>{(balance < 0 ? 0 : balance).toFixed(2)} KWD</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {paymentType && (
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-semibold">{getPaymentTypeLabel()}</p>
              </div>
            )}
            {paymentRefNo && (
              <div>
                <p className="text-gray-600">Reference Number</p>
                <p className="font-semibold">{paymentRefNo}</p>
              </div>
            )}
            {orderTaker && (
              <div>
                <p className="text-gray-600">Order Taken By</p>
                <p className="font-semibold">{orderTaker}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-300">
          <p>Thank you for your business!</p>
          <p className="mt-1">
            For any queries, please contact us at the showroom.
          </p>
        </div>
      </div>
    );
  }
);

OrderInvoice.displayName = "OrderInvoice";
