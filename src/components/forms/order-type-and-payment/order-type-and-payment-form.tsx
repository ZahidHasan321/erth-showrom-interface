"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import { CheckIcon, AlertCircle } from "lucide-react";
import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import HomeDeliveryIcon from "@/assets/home_delivery.png";
import PickUpIcon from "@/assets/pickup.png";
import type { orderSchema } from "@/schemas/work-order-schema";
import type { FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";

// ---------------- Constants ----------------
const discountOptions = [
  { value: "flat", label: "Flat" },
  { value: "byValue", label: "Cash" },
  { value: "referral", label: "Referral" },
  { value: "loyalty", label: "Loyalty" },
] as const;

const smoothTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
};

// ---------------- Component ----------------
interface OrderTypeAndPaymentFormProps {
  onSubmit: (values: z.infer<typeof orderSchema>) => void;
  onProceed?: () => void;
  form: UseFormReturn<z.infer<typeof orderSchema>>;
  optional?: boolean;
  customerAddress?: {
    city?: string;
    area?: string;
    block?: string;
    street?: string;
    houseNumber?: string;
  };
  fabricSelections?: FabricSelectionSchema[];
}

export function OrderTypeAndPaymentForm({
  onSubmit,
  onProceed,
  form,
  optional = true,
  customerAddress,
  fabricSelections = [],
}: OrderTypeAndPaymentFormProps) {
  const [
    charges,
    discountValue = 0,
    advance = 0,
    discountType = "flat",
    discountPercentage = 0,
    orderType = "normal",
    paid = 0,
  ] = useWatch({
    control: form.control,
    name: [
      "charges",
      "discountValue",
      "advance",
      "discountType",
      "discountPercentage",
      "orderType",
      "paid",
    ],
  });

  const orderStatus = useWatch({
    control: form.control,
    name: "orderStatus",
  });

  const isOrderClosed =
    orderStatus === "Completed" || orderStatus === "Cancelled";

  // Check if any fabric has home delivery
  const hasAnyHomeDelivery = React.useMemo(() => {
    return fabricSelections.some((fabric) => fabric.homeDelivery);
  }, [fabricSelections]);

  // Check if any fabric has express delivery
  const hasAnyExpressDelivery = React.useMemo(() => {
    return fabricSelections.some((fabric) => fabric.express);
  }, [fabricSelections]);

  // Auto-select home delivery if any fabric has it
  React.useEffect(() => {
    if (hasAnyHomeDelivery && orderType !== "homeDelivery") {
      form.setValue("orderType", "homeDelivery");
    }
  }, [hasAnyHomeDelivery, orderType, form]);

  // Calculate and set advance
  React.useEffect(() => {
    const advance = charges.fabric + charges.shelf + ((charges.stitching + charges.style) * 0.5);
    form.setValue("advance", advance);
  }, [
    charges.fabric,
    charges.shelf,
    charges.stitching,
    charges.style,
    form,
  ]);

  // Auto delivery charge calculation
  React.useEffect(() => {
    let deliveryCharge = 0;

    // If any fabric has home delivery OR orderType is homeDelivery
    if (hasAnyHomeDelivery || orderType === "homeDelivery") {
      deliveryCharge = 5; // Base home delivery charge

      // Add express charge if any fabric has express
      if (hasAnyExpressDelivery) {
        deliveryCharge += 2; // Total becomes 7 KWD
      }
    }

    form.setValue("charges.delivery", deliveryCharge);
  }, [orderType, hasAnyHomeDelivery, hasAnyExpressDelivery, form]);

  const totalDue = Object.values(charges || {}).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

  // Auto calculate discount
  React.useEffect(() => {
    if (discountType === "flat" && discountPercentage) {
      const discount = parseFloat(
        (totalDue * (discountPercentage / 100)).toFixed(2)
      );
      form.setValue("discountValue", discount);
      form.setValue("discountInKwd", discount.toFixed(2));
    }
  }, [discountPercentage, totalDue, discountType, form]);

  const finalAmount = totalDue - discountValue;
  const balance = finalAmount - paid;

  // Check if address is provided
  const hasAddress = React.useMemo(() => {
    if (!customerAddress) return false;
    return !!(
      customerAddress.city ||
      customerAddress.area ||
      customerAddress.block ||
      customerAddress.street ||
      customerAddress.houseNumber
    );
  }, [customerAddress]);

  const showAddressWarning = orderType === "homeDelivery" && !hasAddress;

  const handleProceed = () => {
    if (showAddressWarning) {
      // Don't proceed if home delivery is selected but address is missing
      return;
    }
    form.handleSubmit((values) => {
      onSubmit(values);
      onProceed?.();
    })();
  };

  const orderTypeOptions = [
    { value: "pickUp", label: "Pick Up", img: PickUpIcon },
    { value: "homeDelivery", label: "Home Delivery", img: HomeDeliveryIcon },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
      >
        {/* Title Section */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              Order & Payment Details
            </h1>
            <p className="text-sm text-muted-foreground">Set order type, discounts, and payment information</p>
          </div>
        </div>

        {/* === Order Type === */}
        {optional && (
          <motion.section
            layout
            transition={smoothTransition}
            className="bg-card rounded-xl border border-border shadow-sm p-6"
          >
            {hasAnyHomeDelivery && (
              <Alert className="mb-4 border-primary/50 bg-primary/5">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">Home Delivery Required</AlertTitle>
                <AlertDescription>
                  One or more fabrics have home delivery selected. The order type is automatically set to Home Delivery.
                </AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  disabled={isOrderClosed || hasAnyHomeDelivery}
                >
                  {orderTypeOptions.map((option) => {
                    const isDisabled = isOrderClosed || (hasAnyHomeDelivery && option.value === "pickUp");
                    return (
                      <label
                        key={option.value}
                        htmlFor={option.value}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg p-6 border-2 transition-all relative",
                          !isDisabled && "cursor-pointer hover:border-primary hover:shadow-md",
                          isDisabled && "opacity-50 cursor-not-allowed",
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
                        <img
                          src={option.img}
                          alt={option.label}
                          className={cn(
                            "h-16 object-contain transition-all",
                            field.value === option.value && "scale-110"
                          )}
                        />
                        <FormLabel className={cn(
                          "mt-3 text-base cursor-pointer transition-all",
                          field.value === option.value
                            ? "font-bold text-primary"
                            : "font-medium text-foreground"
                        )}>
                          {option.label}
                        </FormLabel>
                        <RadioGroupItem
                          id={option.value}
                          value={option.value}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </RadioGroup>
              )}
            />
          </motion.section>
        )}

        {/* Address Warning Alert */}
        <AnimatePresence>
          {showAddressWarning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                  opacity: { delay: 0.1, duration: 0.25 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.25,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.15 },
                },
              }}
              className="overflow-hidden"
            >
              <div className="mb-8">
                <Alert variant="destructive" className="border-2 border-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-bold">Address Required for Home Delivery</AlertTitle>
                  <AlertDescription>
                    Home Delivery is selected, but the customer address is not provided.
                    Please go back to the Demographics step and add the customer's address, or select Pick Up instead.
                  </AlertDescription>
                </Alert>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-6">
          {/* === Select Discount === */}
          <motion.section
            layout
            transition={smoothTransition}
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <header className="bg-primary text-primary-foreground px-6 py-4">
              <h3 className="text-lg font-semibold">Select Discount</h3>
            </header>

            <div className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {discountOptions.map((opt) => {
                      const active = field.value === opt.value;
                      return (
                        <motion.div
                          key={opt.value}
                          layout
                          transition={smoothTransition}
                        >
                          {/* Main Button */}
                          <button
                            type="button"
                            onClick={() =>
                              !isOrderClosed &&
                              field.onChange(active ? undefined : opt.value)
                            }
                            aria-pressed={active}
                            disabled={isOrderClosed}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-4 transition-all w-full",
                              active
                                ? "border-primary bg-background ring-2 ring-primary/20"
                                : "border-border bg-background hover:border-primary/50 hover:shadow-sm",
                              isOrderClosed && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center shrink-0 justify-center">
                                <span className="text-sm font-medium">
                                  {opt.label[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {opt.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {opt.value === "flat" &&
                                    "Apply flat % discount"}
                                  {opt.value === "byValue" &&
                                    "Direct cash discount"}
                                  {opt.value === "referral" &&
                                    "Use referral code"}
                                  {opt.value === "loyalty" &&
                                    "Loyalty benefits"}
                                </div>
                              </div>
                            </div>

                            {/* Proper circular indicator */}
                            <div
                              className={cn(
                                "inline-flex items-center justify-center rounded-full w-7 h-7 border shrink-0 transition-colors",
                                active
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-border"
                              )}
                            >
                              {active ? (
                                <CheckIcon className="w-4 h-4" />
                              ) : (
                                <svg
                                  className="w-3 h-3 text-muted-foreground"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>

                          {/* Animated expanded area — smooth like paymentType */}
                          <motion.div layout transition={smoothTransition}>
                            <AnimatePresence mode="wait">
                              {active && (
                                <motion.div
                                  key={opt.value}
                                  layout
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{
                                    height: "auto",
                                    opacity: 1,
                                    transition: {
                                      height: {
                                        duration: 0.3,
                                        ease: "easeOut",
                                      },
                                      opacity: { delay: 0.1, duration: 0.25 },
                                    },
                                  }}
                                  exit={{
                                    height: 0,
                                    opacity: 0,
                                    transition: {
                                      height: {
                                        duration: 0.25,
                                        ease: "easeInOut",
                                      },
                                      opacity: { duration: 0.15 },
                                    },
                                  }}
                                  className="overflow-hidden"
                                >
                                  <motion.div
                                    key={`${opt.value}-inputs`}
                                    initial={{ opacity: 0, y: -12 }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                      transition: {
                                        delay: 0.1,
                                        duration: 0.3,
                                      },
                                    }}
                                    exit={{
                                      opacity: 0,
                                      y: -10,
                                      transition: { duration: 0.2 },
                                    }}
                                    className="mt-3 p-4 rounded-lg border border-border bg-accent/5"
                                  >
                                    {/* === Input Variants === */}
                                    {opt.value === "flat" && (
                                      <div className="flex flex-wrap gap-3 items-center">
                                        <FormField
                                          control={form.control}
                                          name="discountPercentage"
                                          render={({ field: pField }) => (
                                            <Input
                                              type="number"
                                              placeholder="Discount %"
                                              className="w-32 bg-background border-border/60"
                                              {...pField}
                                              disabled={isOrderClosed}
                                              onChange={(e) =>
                                                pField.onChange(
                                                  e.target.value === ""
                                                    ? undefined
                                                    : e.target.valueAsNumber
                                                )
                                              }
                                            />
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="discountInKwd"
                                          render={({ field: kField }) => (
                                            <Input
                                              type="text"
                                              placeholder="Discount (KWD)"
                                              readOnly
                                              className="w-40 bg-muted border-border/60"
                                              {...kField}
                                            />
                                          )}
                                        />
                                      </div>
                                    )}

                                    {opt.value === "byValue" && (
                                      <div className="flex flex-wrap gap-3 items-center">
                                        <FormField
                                          control={form.control}
                                          name="discountValue"
                                          render={({ field: cashField }) => (
                                            <Input
                                              type="number"
                                              placeholder="Discount (KWD)"
                                              className="w-40 bg-background border-border/60"
                                              value={cashField.value || ""}
                                              disabled={isOrderClosed}
                                              onChange={(e) =>
                                                cashField.onChange(
                                                  e.target.value === ""
                                                    ? 0
                                                    : e.target.valueAsNumber
                                                )
                                              }
                                            />
                                          )}
                                        />
                                      </div>
                                    )}

                                    {opt.value === "referral" && (
                                      <div className="flex flex-col gap-3">
                                        <FormField
                                          control={form.control}
                                          name="referralCode"
                                          render={({ field: rField }) => (
                                            <Input
                                              placeholder="Reference Code"
                                              {...rField}
                                              disabled={isOrderClosed}
                                              className="w-full bg-background border-border/60"
                                            />
                                          )}
                                        />
                                        <div className="flex flex-wrap gap-3">
                                          <Input
                                            placeholder="Discount %"
                                            disabled={isOrderClosed}
                                            className="w-32 md:w-40 bg-background border-border/60"
                                          />
                                          <Input
                                            placeholder="Discount (KWD)"
                                            disabled={isOrderClosed}
                                            className="w-40 md:w-48 bg-background border-border/60"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {opt.value === "loyalty" && (
                                      <div className="flex flex-wrap gap-3 items-center">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          disabled={isOrderClosed}
                                        >
                                          Check Loyalty
                                        </Button>
                                        <Input
                                          placeholder="Discount %"
                                          disabled={isOrderClosed}
                                          className="w-32 md:w-40 bg-background border-border/60"
                                        />
                                        <Input
                                          placeholder="Discount (KWD)"
                                          disabled={isOrderClosed}
                                          className="w-40 md:w-48 bg-background border-border/60"
                                        />
                                      </div>
                                    )}
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              />

              <p className="text-destructive italic text-sm text-center bg-destructive/10 rounded-lg py-3 px-4 mt-4 border border-destructive/20">
                Only one discount can be applied. No discounts on Installments.
              </p>
            </div>
          </motion.section>

          {/* === Charges Summary === */}
          <motion.section
            layout
            transition={smoothTransition}
            className="bg-card rounded-xl border border-border shadow-sm p-6 text-lg space-y-3"
          >
            <h3 className="text-lg font-semibold mb-3 text-foreground">Charges Summary</h3>

            {optional && charges && (
              <div className="text-muted-foreground border-b border-border pb-3 mb-3 space-y-2 text-base">
                {[
                  ["Fabric", charges.fabric],
                  ["Stitching", charges.stitching],
                  ["Style", charges.style],
                  ["Delivery", charges.delivery],
                  ["Shelf", charges.shelf],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span className="font-medium">{val} KWD</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between font-semibold text-base">
              <span>Total Due</span>
              <span className="text-primary">{totalDue.toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Discount</span>
              <span className="text-secondary">{discountValue.toFixed(2)} KWD</span>
            </div>
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <div className="flex flex-col gap-2 text-base">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold">Paid</span>
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="w-32 text-left bg-background border-border/60 pr-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : e.target.valueAsNumber
                          )
                        }
                        disabled={isOrderClosed}
                      />
                      <span className="absolute right-2 text-muted-foreground pointer-events-none">KWD</span>
                    </div>                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    Suggested advance: {advance.toFixed(2)} KWD
                  </div>
                </div>
              )}
            />
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Balance</span>
              <span className="text-primary">{(balance < 0 ? 0 : balance).toFixed(2)} KWD</span>
            </div>
          </motion.section>
        </div>

        {/* === Footer === */}
        {!isOrderClosed && (
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              onClick={handleProceed}
              disabled={showAddressWarning}
            >
              Continue to Confirmation →
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
