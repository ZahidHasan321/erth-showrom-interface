"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import { CheckIcon } from "lucide-react";
import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import HomeDeliveryIcon from "@/assets/home_delivery.png";
import PickUpIcon from "@/assets/pickup.png";
import type { orderSchema } from "@/schemas/work-order-schema";

// ---------------- Constants ----------------
const discountOptions = [
  { value: "flat", label: "Flat" },
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
}

export function OrderTypeAndPaymentForm({
  onSubmit,
  onProceed,
  form,
  optional = true,
}: OrderTypeAndPaymentFormProps) {
  const [
    charges,
    discountValue = 0,
    advance = 0,
    discountType = "flat",
    discountPercentage = 0,
    orderType = "normal",
  ] = useWatch({
    control: form.control,
    name: [
      "charges",
      "discountValue",
      "advance",
      "discountType",
      "discountPercentage",
      "orderType",
    ],
  });

  React.useEffect(() => {
    form.setValue("charges.delivery", orderType === "homeDelivery" ? 5 : 0);
    const advance = charges.fabric + charges.shelf + charges.stitching * 0.5;
    form.setValue("advance", advance);
  }, [
    charges.fabric,
    charges.shelf,
    charges.stitching,
    charges.style,
    charges.delivery,
    form,
  ]);

  // Auto delivery charge
  React.useEffect(() => {
    form.setValue("charges.delivery", orderType === "homeDelivery" ? 5 : 0);
  }, [orderType, form]);

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
    } else {
      form.setValue("discountValue", 0);
      form.setValue("discountInKwd", "0.00");
    }
  }, [discountPercentage, totalDue, discountType, form]);

  const finalAmount = totalDue - discountValue;
  const balance = finalAmount - advance;

  const handleProceed = () => {
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
        className="space-y-10 w-full"
      >
        {/* === Order Type === */}
        {optional && (
          <motion.section
            layout
            transition={smoothTransition}
            className="rounded-lg border bg-muted p-4"
          >
            <h3 className="text-xl font-semibold mb-3">Order Type & Payment</h3>
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {orderTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={option.value}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg p-4 bg-white border cursor-pointer transition-all",
                        "hover:border-green-500 hover:shadow-md",
                        field.value === option.value &&
                          "border-green-500 ring-2 ring-green-400"
                      )}
                    >
                      <img
                        src={option.img}
                        alt={option.label}
                        className="h-16 object-contain"
                      />
                      <FormLabel className="mt-2 font-medium text-sm">
                        {option.label}
                      </FormLabel>
                      <RadioGroupItem
                        id={option.value}
                        value={option.value}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
          </motion.section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* === Select Discount === */}
          <motion.section
            layout
            transition={smoothTransition}
            className="rounded-xl border shadow-sm overflow-hidden"
          >
            <header className="bg-primary text-primary-foreground px-6 py-3">
              <h3 className="text-lg font-semibold">Select Discount</h3>
            </header>

            <div className="p-6 bg-muted/20">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discountOptions.map((opt) => {
                      const active = field.value === opt.value;
                      return (
                        <motion.div
                          key={opt.value}
                          layout
                          transition={smoothTransition}
                          className={cn(
                            opt.value === "loyalty" && "md:col-span-2"
                          )}
                        >
                          {/* Main Button */}
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(active ? undefined : opt.value)
                            }
                            aria-pressed={active}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-4 transition-all w-full",
                              active
                                ? "border-green-500 bg-white ring-2 ring-green-200"
                                : "border-border bg-white hover:shadow-sm",
                              opt.value === "loyalty"
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
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "bg-white border-border"
                              )}
                            >
                              {active ? (
                                <CheckIcon className="w-4 h-4 text-white" />
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
                                    className="mt-3 p-3 rounded-md border bg-white/80"
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
                                              className="w-32"
                                              {...pField}
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
                                              className="w-40 bg-muted/50"
                                              {...kField}
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
                                              className="w-full"
                                            />
                                          )}
                                        />
                                        <div className="flex flex-wrap gap-3">
                                          <Input
                                            placeholder="Discount %"
                                            className="w-32 md:w-40 text-base py-2"
                                          />
                                          <Input
                                            placeholder="Discount (KWD)"
                                            className="w-40 md:w-48 text-base py-2"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {opt.value === "loyalty" && (
                                      <div className="flex flex-wrap gap-3 items-center">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="bg-accent/40 hover:bg-accent/60"
                                        >
                                          Check Loyalty
                                        </Button>
                                        <Input
                                          placeholder="Discount %"
                                          className="w-32 md:w-40 text-base py-2"
                                        />
                                        <Input
                                          placeholder="Discount (KWD)"
                                          className="w-40 md:w-48 text-base py-2"
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

              <p className="text-destructive italic text-sm text-center bg-destructive/10 rounded-md py-3 mt-6">
                Only one discount can be applied. No discounts on Installments.
              </p>
            </div>
          </motion.section>

          {/* === Charges Summary === */}
          <motion.section
            layout
            transition={smoothTransition}
            className="rounded-lg border bg-muted p-6 text-lg space-y-2"
          >
            <h3 className="text-xl font-bold mb-2">Charges Summary</h3>

            {optional && charges && (
              <div className="text-muted-foreground border-b border-border pb-2 mb-2 space-y-1">
                {[
                  ["Fabric", charges.fabric],
                  ["Stitching", charges.stitching],
                  ["Style", charges.style],
                  ["Delivery", charges.delivery],
                  ["Shelf", charges.shelf],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span>{val} KWD</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between font-semibold text-purple-600">
              <span>Total Due</span>
              <span>{totalDue.toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600">
              <span>Discount</span>
              <span>{discountValue.toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between">
              <span>Advance</span>
              <span>
                {(balance < 0 ? advance + balance : advance).toFixed(2)} KWD
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Balance</span>
              <span>{(balance < 0 ? 0 : balance).toFixed(2)} KWD</span>
            </div>
          </motion.section>
        </div>

        {/* === Footer === */}
        <div className="flex justify-end pt-2">
          <Button type="button" onClick={handleProceed}>
            Proceed
          </Button>
        </div>
      </form>
    </Form>
  );
}
