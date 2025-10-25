import * as React from "react";
import type { FabricSelectionSchema } from "./fabric-selection-schema";

interface FabricPrintSummaryProps {
  fabricData: FabricSelectionSchema;
  customerName?: string;
  orderNumber?: string;
}

export const FabricPrintSummary = React.forwardRef<
  HTMLDivElement,
  FabricPrintSummaryProps
>(({ fabricData, customerName, orderNumber }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-black">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">Fabric Order Summary</h1>
        {orderNumber && (
          <p className="text-lg">Order #: {orderNumber}</p>
        )}
        {customerName && (
          <p className="text-lg">Customer: {customerName}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Garment Information */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
            Garment Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Garment ID:</span>
              <span className="ml-2">{fabricData.garmentId || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium">Measurement ID:</span>
              <span className="ml-2">{fabricData.measurementId || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium">Brova:</span>
              <span className="ml-2">{fabricData.brova ? "Yes" : "No"}</span>
            </div>
            <div>
              <span className="font-medium">Express:</span>
              <span className="ml-2">{fabricData.express ? "Yes ⚡" : "No"}</span>
            </div>
          </div>
        </section>

        {/* Fabric Details */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
            Fabric Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Source:</span>
              <span className="ml-2 font-semibold">
                {fabricData.fabricSource === "In" ? "Internal" : "External"}
              </span>
            </div>
            <div>
              <span className="font-medium">Color:</span>
              <span className="ml-2">{fabricData.color || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium">Fabric Length:</span>
              <span className="ml-2">{fabricData.fabricLength || "N/A"} meters</span>
            </div>
            <div>
              <span className="font-medium">Fabric Amount:</span>
              <span className="ml-2 font-semibold">
                {fabricData.fabricAmount
                  ? `${fabricData.fabricAmount.toFixed(2)} SAR`
                  : "N/A"}
              </span>
            </div>
          </div>
        </section>

        {/* Delivery Information */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
            Delivery Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Delivery Date:</span>
              <span className="ml-2">
                {fabricData.deliveryDate
                  ? new Date(fabricData.deliveryDate).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
          </div>
        </section>

        {/* Notes */}
        {fabricData.note && (
          <section>
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
              Notes
            </h2>
            <p className="whitespace-pre-wrap">{fabricData.note}</p>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
        <p>Thank you for your order!</p>
        <p className="mt-1">
          For any queries, please contact us at your convenience.
        </p>
      </div>
    </div>
  );
});