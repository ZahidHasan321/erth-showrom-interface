import * as React from "react";
import ErthLogo from "@/assets/erth-light.svg";
import type { FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import type { StyleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import type { OrderSchema } from "@/schemas/work-order-schema";
import type { ShelvesFormValues } from "@/components/forms/shelved-products/schema";
import type { Fabric } from "@/types/fabric";
import type { Style } from "@/types/style";

export interface InvoiceData {
  orderId?: string;
  fatoura?: number;
  orderDate?: string;
  homeDelivery?: boolean;
  orderStatus?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: {
    city?: string;
    area?: string;
    block?: string;
    street?: string;
    houseNumber?: string;
  };
  fabricSelections?: FabricSelectionSchema[];
  styleOptions?: StyleOptionsSchema[];
  shelvedProducts?: ShelvesFormValues["products"];
  fabrics?: Fabric[];
  styles?: Style[];
  charges?: OrderSchema["charges"];
  discountType?: string;
  discountValue?: number;
  discountPercentage?: number;
  advance?: number;
  paid: number;
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
      fatoura,
      orderDate,
      homeDelivery,
      customerName,
      customerPhone,
      fabricSelections = [],
      styleOptions = [],
      shelvedProducts = [],
      fabrics = [],
      charges,
      discountType,
      discountValue = 0,
      discountPercentage = 0,
      paid,
      paymentType,
      otherPaymentType,
      paymentRefNo,
    } = data;

    // Helper function to get fabric name from fabricId
    const getFabricName = (fabricId: string) => {
      const fabric = fabrics.find(f => f.id === fabricId);
      return fabric?.fields?.Name || fabric?.fields?.Code || "Unknown Fabric";
    };

    const totalDue = charges
      ? Object.values(charges).reduce((acc, val) => acc + (val || 0), 0)
      : 0;
    const finalAmount = totalDue - discountValue;
    const balance = finalAmount - paid;

    const formattedDate = orderDate
      ? new Date(orderDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    const getPaymentTypeLabel = () => {
      if (paymentType === "others") return otherPaymentType || "Others";
      if (paymentType === "k-net") return "K-Net";
      if (paymentType === "cash") return "Cash";
      if (paymentType === "link-payment") return "Link Payment";
      if (paymentType === "installments") return "Installments";
      return paymentType;
    };

    return (
      <div
        ref={ref}
        className="bg-white text-black p-6 max-w-4xl mx-auto text-sm print:bg-white print:text-black"
        style={{ direction: 'rtl' }}
      >
        {/* Header */}
        <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #374151' }}>
          <div className="text-center mb-3">
            <img src={ErthLogo} alt="ERTH Clothing" className="h-16 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">ERTH Clothing</h1>
          </div>
          <div className="flex justify-between items-start">
            <div className="text-right">
              {(fatoura || orderId) && (
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Invoice # | رقم الفاتورة: {fatoura || orderId}</span>
                </p>
              )}
              {formattedDate && (
                <p className="text-xs text-gray-600">Date | التاريخ: {formattedDate}</p>
              )}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-800">Purchase Invoice | فاتورة شراء</h2>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1" style={{ borderBottom: '1px solid #374151' }}>
            Customer Information | معلومات العميل
          </h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {customerName && (
              <div className="py-1 px-2 text-right" style={{ borderLeft: '1px solid #d1d5db' }}>
                <span className="text-gray-600">Name | الاسم: </span>
                <span className="font-semibold">{customerName}</span>
              </div>
            )}
            {customerPhone && (
              <div className="py-1 px-2 text-right" style={{ borderLeft: '1px solid #d1d5db' }}>
                <span className="text-gray-600">Phone | رقم الهاتف: </span>
                <span className="font-semibold">{customerPhone}</span>
              </div>
            )}
            {homeDelivery !== undefined && (
              <div className="py-1 px-2 text-right flex items-center gap-3">
                <span className="text-gray-600">Delivery | التوصيل:</span>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 border-2 border-gray-600 items-center justify-center" style={{
                    backgroundColor: !homeDelivery ? "#374151" : "transparent"
                  }}>
                    {!homeDelivery && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <span className="text-xs">Pick Up | استلام</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 border-2 border-gray-600 items-center justify-center" style={{
                    backgroundColor: homeDelivery ? "#374151" : "transparent"
                  }}>
                    {homeDelivery && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <span className="text-xs">Home | منزلي</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        {(fabricSelections.length > 0 || shelvedProducts.length > 0) && (
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1" style={{ borderBottom: '1px solid #374151' }}>
              Order Items | بنود الطلب
            </h3>

            {/* Fabric Selections - Inside Source */}
            {fabricSelections.filter(f => f.fabricSource === "In").length > 0 && (
              <div className="mb-2">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">
                  Fabrics (Inside) | القماش (من الداخل)
                </h4>
                <table className="w-full text-xs" style={{ border: '1px solid #374151', borderCollapse: 'collapse' }}>
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Price (KWD) | سعر القماش
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Length (m) | الطول (متر)
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Unit Price | سعر/متر
                      </th>
                      <th className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>
                        Qty | العدد
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Fabric | القماش
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const insideFabrics = fabricSelections.filter(f => f.fabricSource === "In");
                      const grouped = insideFabrics.reduce((acc, fabric) => {
                        const fabricName = getFabricName(fabric.fabricId || "");
                        const unitPrice = fabric.fabricAmount / parseFloat(fabric.fabricLength);
                        
                        if (!acc[fabricName]) {
                          acc[fabricName] = {
                            name: fabricName,
                            quantity: 0,
                            unitPrice: unitPrice,
                            totalLength: 0,
                            totalPrice: 0,
                          };
                        }
                        
                        acc[fabricName].quantity += 1;
                        acc[fabricName].totalLength += parseFloat(fabric.fabricLength);
                        acc[fabricName].totalPrice += fabric.fabricAmount;
                        
                        return acc;
                      }, {} as Record<string, { name: string; quantity: number; unitPrice: number; totalLength: number; totalPrice: number }>);

                      const groupedArray = Object.values(grouped);
                      const totalFabricCharges = groupedArray.reduce((sum, item) => sum + item.totalPrice, 0);

                      return (
                        <>
                          {groupedArray.map((item, idx) => (
                            <tr key={idx} className="even:bg-gray-50">
                              <td className="py-1 px-2 text-right font-semibold" style={{ border: '1px solid #374151' }}>{item.totalPrice.toFixed(2)}</td>
                              <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>{item.totalLength.toFixed(1)}</td>
                              <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>{item.unitPrice.toFixed(2)}</td>
                              <td className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>{item.quantity}</td>
                              <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>{item.name}</td>
                              <td className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>{idx + 1}</td>
                            </tr>
                          ))}
                          <tr style={{ backgroundColor: '#e0f2fe', fontWeight: 'bold' }}>
                            <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151', color: '#0c4a6e' }}>{totalFabricCharges.toFixed(2)}</td>
                            <td colSpan={5} className="py-1 px-2 text-right" style={{ border: '1px solid #374151', color: '#0c4a6e' }}>
                              Total Fabrics | إجمالي الأقمشة
                            </td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* Style Options */}
            {fabricSelections.length > 0 && (
              <div className="mb-2">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">
                  Style Options | الخيارات
                </h4>
                <table className="w-full text-xs" style={{ border: '1px solid #374151', borderCollapse: 'collapse' }}>
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Total | الإجمالي
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Options | الخيارات
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Stitching | الخياطة
                      </th>
                      <th className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>
                        Qty | العدد
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Item | الصنف
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const grouped = styleOptions.reduce((acc, option) => {
                        const extraAmount = option?.extraAmount || 0;
                        const style = option?.style || "kuwaiti";
                        
                        let itemName = "";
                        let stitchingCharge = 9;
                        let optionsCharge = 0;
                        
                        if (style === "kuwaiti") {
                          if (extraAmount === 9) {
                            itemName = "Default";
                            optionsCharge = 0;
                          } else {
                            itemName = "Dishdasha";
                            optionsCharge = extraAmount - 9;
                          }
                        } else if (style === "designer") {
                          itemName = "Designer";
                          stitchingCharge = 9;
                          optionsCharge = 6;
                        }
                        
                        if (!acc[itemName]) {
                          acc[itemName] = {
                            name: itemName,
                            quantity: 0,
                            stitchingCharge: stitchingCharge,
                            optionsCharge: optionsCharge,
                            total: 0,
                          };
                        }
                        
                        acc[itemName].quantity += 1;
                        acc[itemName].total += stitchingCharge + optionsCharge;
                        
                        return acc;
                      }, {} as Record<string, { name: string; quantity: number; stitchingCharge: number; optionsCharge: number; total: number }>);

                      const groupedArray = Object.values(grouped);
                      const totalCharges = groupedArray.reduce((sum, item) => sum + item.total, 0);

                      return (
                        <>
                          {groupedArray.map((item, idx) => (
                            <tr key={idx} className="even:bg-gray-50">
                              <td className="py-1 px-2 text-right font-semibold" style={{ border: '1px solid #374151' }}>{item.total}</td>
                              <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>{item.optionsCharge}</td>
                              <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>{item.stitchingCharge}</td>
                              <td className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>{item.quantity}</td>
                              <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>{item.name}</td>
                              <td className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>{idx + 1}</td>
                            </tr>
                          ))}
                          <tr style={{ backgroundColor: '#ddd6fe', fontWeight: 'bold' }}>
                            <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151', color: '#4c1d95' }}>{totalCharges}</td>
                            <td colSpan={5} className="py-1 px-2 text-right" style={{ border: '1px solid #374151', color: '#4c1d95' }}>
                              Total | الإجمالي
                            </td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* Shelved Products */}
            {shelvedProducts.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">
                  Sales Products | منتجات المبيعات
                </h4>
                <table className="w-full text-xs" style={{ border: '1px solid #374151', borderCollapse: 'collapse' }}>
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Total | الإجمالي
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Unit Price | سعر الوحدة
                      </th>
                      <th className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>
                        Qty | العدد
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        Item | الصنف
                      </th>
                      <th className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shelvedProducts.map((product, idx) => {
                      const finalPrice = (product.unitPrice || 0) * (product.quantity || 1);
                      return (
                        <tr key={product.id} className="even:bg-gray-50">
                          <td className="py-1 px-2 text-right font-semibold" style={{ border: '1px solid #374151' }}>
                            {finalPrice.toFixed(2)}
                          </td>
                          <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                            {(product.unitPrice || 0).toFixed(2)}
                          </td>
                          <td className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>
                            {product.quantity || 1}
                          </td>
                          <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151' }}>
                            {product.productType || "N/A"}
                          </td>
                          <td className="py-1 px-2 text-center" style={{ border: '1px solid #374151' }}>{idx + 1}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ backgroundColor: '#fce7f3', fontWeight: 'bold' }}>
                      <td className="py-1 px-2 text-right" style={{ border: '1px solid #374151', color: '#831843' }}>
                        {shelvedProducts.reduce((sum, p) => sum + ((p.unitPrice || 0) * (p.quantity || 1)), 0).toFixed(2)}
                      </td>
                      <td colSpan={4} className="py-1 px-2 text-right" style={{ border: '1px solid #374151', color: '#831843' }}>
                        Total | الإجمالي
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Total Charges */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1" style={{ borderBottom: '1px solid #374151' }}>
            Total Charges | إجمالي الرسوم
          </h3>
          <div className="bg-gray-50 p-3" style={{ border: '1px solid #374151' }}>
            <div className="space-y-1 text-xs mb-2">
              <div className="flex justify-between py-1" style={{ borderBottom: '1px solid #374151' }}>
                <span className="font-semibold">{totalDue.toFixed(2)} KWD</span>
                <span className="font-semibold">Total | الإجمالي</span>
              </div>

              {discountValue > 0 && (
                <>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">- {discountValue.toFixed(2)} KWD</span>
                    <span className="text-gray-700">
                      Discount | الخصم
                      {discountType === "flat" && discountPercentage > 0
                        ? ` (${discountPercentage}%)`
                        : discountType
                          ? ` (${discountType})`
                          : ""}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold">
                      {(totalDue - discountValue).toFixed(2)} KWD
                    </span>
                    <span className="text-gray-700">After Discount | بعد الخصم</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-1">
                <span className="font-semibold">
                  {paid.toFixed(2)} KWD
                </span>
                <span className="text-gray-700">Paid | المدفوع</span>
              </div>
              <div className="flex justify-between pt-2" style={{ borderTop: '1px solid #374151' }}>
                <span className="font-bold">
                  {(balance < 0 ? 0 : balance).toFixed(2)} KWD
                </span>
                <span className="font-bold">Balance | المتبقي</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mt-2 pt-2 grid grid-cols-2 gap-2 text-xs" style={{ borderTop: '1px solid #374151' }}>
              {paymentType && (
                <div className="py-1 px-2 text-right" style={{ borderLeft: '1px solid #d1d5db' }}>
                  <span className="text-gray-600">Payment Method | دفع عن طريق: </span>
                  <span className="font-semibold">{getPaymentTypeLabel()}</span>
                </div>
              )}
              {paymentRefNo && (
                <div className="py-1 px-2 text-right">
                  <span className="text-gray-600">Ref # | رقم المرجع: </span>
                  <span className="font-semibold">{paymentRefNo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid #374151' }}>
          <h4 className="text-xs font-semibold text-gray-800 mb-2 text-center">
            الملاحظات والشروط
          </h4>
          <div className="text-right text-gray-700 text-[10px] leading-relaxed">
            <ul className="space-y-1">
              <li>• سيتم التواصل معك لتحديد موعد البروفة.</li>
              <li>• التأخير عن البروفة يؤخر موعد التسليم.</li>
              <li>• أي تعديل بعد اعتماد البروفة يُحسب برسوم.</li>
              <li>• يجب سداد 50% من مبلغ الفاتورة على الأقل.</li>
              <li>• لا يتم التسليم إلا بعد سداد المبلغ كاملاً.</li>
              <li>• تأخير الاستلام النهائي لأكثر من شهر من جاهزية الطلب لا يلزم الشركة بتغيير المقاسات.</li>
              <li>• خدمة الاستعجال متوفرة برسوم إضافية عند الطلب.</li>
            </ul>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3 font-semibold">
            شكراً لاختياركم ERTH Clothing
          </p>
        </div>
      </div>
    );
  }
);

OrderInvoice.displayName = "OrderInvoice";