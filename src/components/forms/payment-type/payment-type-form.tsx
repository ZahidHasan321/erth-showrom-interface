"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { type PaymentTypeSchema } from "./schema";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/api/employees";
import { CheckIcon, Check, Printer, X, Receipt, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import * as React from "react";
import { OrderInvoice, type InvoiceData } from "@/components/invoice";
import { useFatouraPolling } from "@/hooks/useFatouraPolling";

import KNetLogo from "@/assets/payment-assets/knet.png";
import CashIcon from "@/assets/payment-assets/cash.png";
import LinkPaymentIcon from "@/assets/payment-assets/linkPayment.png";
import InstallmentsIcon from "@/assets/payment-assets/installments.png";

interface PaymentTypeFormProps {
  form: UseFormReturn<PaymentTypeSchema>;
  onConfirm: (values: PaymentTypeSchema) => void;
  onCancel: () => void;
  isOrderClosed?: boolean;
  invoiceData?: InvoiceData;
  orderRecordId?: string | null;
  orderStatus?: "Pending" | "Completed" | "Cancelled";
  useFatoura?: boolean;
}

export function PaymentTypeForm({
  form,
  onConfirm,
  onCancel,
  isOrderClosed,
  invoiceData,
  orderRecordId,
  orderStatus,
  useFatoura = true,
}: PaymentTypeFormProps) {
  const paymentType = useWatch({ control: form.control, name: "paymentType" });
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  // Poll for fatoura number when order is completed (only for work orders)
  const { fatoura, isLoadingFatoura, hasFatoura } = useFatouraPolling(
    orderRecordId,
    orderStatus === "Completed",
    useFatoura
  );

  // Fetch employees data
  const { data: employeesResponse } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const employees = employeesResponse?.data || [];

  // Print handler
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${invoiceData?.orderId || "Draft"}`,
  });

  const paymentOptions = [
    { value: "k-net", label: "K-Net", img: KNetLogo },
    { value: "cash", label: "Cash", img: CashIcon },
    { value: "link-payment", label: "Link Payment", img: LinkPaymentIcon },
    { value: "installments", label: "Installments", img: InstallmentsIcon },
    { value: "others", label: "Others", icon: <Receipt className="w-10 h-10" /> },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onConfirm)}
        className="space-y-8 w-full"
      >
        {/* Title Section */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              Payment & Confirmation
            </h1>
            <p className="text-sm text-muted-foreground">Select payment method and confirm the order</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* Left Section — Payment Types */}
          <motion.div
            layout
            transition={{
              layout: { type: "spring", stiffness: 220, damping: 28 },
            }}
            className="flex-1 bg-card p-6 rounded-xl border border-border shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Payment Type</h3>

          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isOrderClosed}
                    className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6"
                  >
                    {paymentOptions.map((option) => (
                      <label
                        key={option.value}
                        htmlFor={option.value}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg p-4 border-2 transition-all cursor-pointer relative",
                          "hover:border-primary hover:shadow-md",
                          field.value === option.value
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-lg"
                            : "border-border bg-background"
                        )}
                      >
                        {field.value === option.value && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className="h-16 w-16 flex items-center justify-center">
                          {option.img ? (
                            <img
                              src={option.img}
                              alt={option.label}
                              className={cn(
                                "max-h-16 object-contain transition-all",
                                field.value === option.value && "scale-110"
                              )}
                            />
                          ) : (
                            <div className={cn(
                              "transition-all",
                              field.value === option.value && "scale-110"
                            )}>
                              {option.icon}
                            </div>
                          )}
                        </div>

                        <FormLabel className={cn(
                          "mt-3 text-sm cursor-pointer transition-all",
                          field.value === option.value
                            ? "font-bold text-primary"
                            : "font-medium text-foreground"
                        )}>
                          {option.label}
                        </FormLabel>

                        {/* Hide the default radio, make the whole label clickable */}
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Animated Others Input */}
          {/* Animated Others Input */}
          <motion.div layout transition={{ layout: { duration: 0.4 } }}>
            <AnimatePresence mode="wait">
              {paymentType === "others" && (
                <motion.div
                  key="others-input-wrapper"
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { delay: 0.1, duration: 0.25 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.25, ease: "easeInOut" },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    key="others-input"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.1, duration: 0.3 },
                    }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    className="mt-6"
                  >
                    <FormField
                      control={form.control}
                      name="otherPaymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please Specify</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter payment type"
                              {...field}
                              disabled={isOrderClosed}
                              className="bg-background border-border/60"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

          {/* Right Section — Actions */}
          <motion.div
            layout
            className="flex flex-row justify-between bg-card p-6 rounded-xl border border-border shadow-sm w-full space-y-4 gap-x-12"
            transition={{
              layout: { type: "spring", stiffness: 220, damping: 28 },
            }}
          >
            <div className="flex-1 flex flex-col justify-between space-y-4">
            <h3 className="text-lg font-semibold mb-2">Order Details</h3>
            <FormField
              control={form.control}
              name="paymentRefNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Ref. No.
                    {paymentType !== "cash" && (
                      <span className="text-destructive"> *</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter reference no."
                      {...field}
                      disabled={isOrderClosed}
                      className="bg-background border-border/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderTaker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Taker</FormLabel>
                  <FormControl>
                    <Combobox
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: emp.fields.Name,
                      }))}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Select order taker"
                      disabled={isOrderClosed}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <motion.div layout className="flex-1 flex flex-col gap-3 pt-4">
              {!isOrderClosed && (
                <Button type="submit">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Order
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                disabled={!isOrderClosed || (useFatoura && !hasFatoura)}
              >
                {useFatoura && isLoadingFatoura ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Invoice...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </>
                )}
              </Button>
              {!isOrderClosed && (
                <Button type="button" variant="destructive" onClick={onCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Hidden Invoice Component for Printing */}
        <div className="hidden print:block">
          {invoiceData && (useFatoura ? hasFatoura : isOrderClosed) && (
            <OrderInvoice ref={invoiceRef} data={{ ...invoiceData, fatoura: useFatoura ? fatoura : undefined }} />
          )}
        </div>

        {/* Loading State Overlay */}
        {useFatoura && isOrderClosed && isLoadingFatoura && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-card p-8 rounded-xl border border-border shadow-lg flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Generating Invoice Number
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we generate your invoice number...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </Form>
  );
}
