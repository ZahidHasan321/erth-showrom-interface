import { z } from "zod";
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
import { cn } from "@/lib/utils";
import { orderTypeAndPaymentSchema } from "./schema";
import type { UseFormReturn } from "react-hook-form";
import React from "react";
import PickUpIcon from "@/assets/pickup.png";
import HomeDeliveryIcon from "@/assets/home_delivery.png";
import { CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderTypeAndPaymentFormProps {
  onSubmit: (values: z.infer<typeof orderTypeAndPaymentSchema>) => void;
  onProceed?: () => void;
  form: UseFormReturn<z.infer<typeof orderTypeAndPaymentSchema>>;
  optional?: boolean;
}

export function OrderTypeAndPaymentForm({
  onSubmit,
  onProceed,
  form,
  optional = true,
}: OrderTypeAndPaymentFormProps) {
  const charges = form.watch("charges");
  const discountValue = form.watch("discountValue") || 0;
  const advance = form.watch("advance") || 0;
  const discountType = form.watch("discountType");
  const discountPercentage = form.watch("discountPercentage");
  const orderType = form.watch("orderType");

  const orderTypeOptions = [
    { value: "pickUp", label: "Pick Up", img: PickUpIcon },
    { value: "homeDelivery", label: "Home Delivery", img: HomeDeliveryIcon },
  ];

  React.useEffect(() => {
    if (orderType === "homeDelivery") {
      form.setValue("charges.delivery", 5);
    } else {
      form.setValue("charges.delivery", 0);
    }
  }, [orderType, form]);

  const totalDue = Object.values(charges || {}).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

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

  function handleProceed() {
    form.handleSubmit((values) => {
      onSubmit(values);
      if (onProceed) {
        onProceed();
      }
    })();
  }

  const discountOptions = [
    { value: "flat", label: "Flat" },
    { value: "referral", label: "Referral" },
    { value: "loyalty", label: "Loyalty" },
  ] as const;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full p-4 max-w-7xl"
      >
        {/* Section 1: Order Type & Payment */}
        {optional && (
          <div className="rounded-lg border p-4 bg-muted space-y-4">
            <h3 className="text-2xl font-bold mb-4">Order Type & Payment</h3>
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                    >
                      {orderTypeOptions.map((option) => (
                        <label
                          key={option.value}
                          htmlFor={option.value}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-lg p-4 bg-white border hover:border-green-500 hover:shadow-lg transition-all cursor-pointer",
                            field.value === option.value &&
                            "border-green-500 ring-2 ring-green-400"
                          )}
                        >
                          <div className="h-16 w-16 flex items-center justify-center">
                            {option.img ? (
                              <img
                                src={option.img}
                                alt={option.label}
                                className="max-h-16 object-contain"
                              />
                            ) : (
                              <span className="text-4xl">{option.label}</span>
                            )}
                          </div>

                          <FormLabel className="mt-3 font-medium text-sm">
                            {option.label}
                          </FormLabel>

                          {/* Hide the default radio, make the whole label clickable */}
                          <RadioGroupItem id={option.value} value={option.value} className="sr-only" />
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Updated Section 2: Select Discount (single FormField for discountType) */}
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-md overflow-hidden transition-all hover:shadow-lg w-full">
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
                Select Discount
              </h3>
            </div>

            {/* Body */}
            <div className="flex flex-col justify-between bg-accent/25 p-6 md:p-8 rounded-b-2xl min-h-[400px]">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* grid of cards; each cell contains button + its own detail area */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {discountOptions.map((opt) => {
                          const active = field.value === opt.value;
                          return (
                            <div key={opt.label} className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => field.onChange(active ? undefined : opt.value)}
                                aria-pressed={active}
                                className={cn(
                                  "relative flex items-center justify-between p-4 rounded-lg border transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-1",
                                  active
                                    ? "border-green-500 ring-2 ring-green-200 shadow-md bg-white"
                                    : "border-border bg-white/90 hover:shadow-sm"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/10">
                                    <span className="text-sm font-medium">{opt.label.charAt(0)}</span>
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{opt.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {opt.value === "flat" && "Apply a flat % discount"}
                                      {opt.value === "referral" && "Use referral code"}
                                      {opt.value === "loyalty" && "Loyalty benefits"}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "inline-flex items-center justify-center rounded-full w-7 h-7 border",
                                      active ? "bg-green-500 border-green-500 text-white" : "bg-white border-border"
                                    )}
                                    aria-hidden
                                  >
                                    {active ? (
                                      <CheckIcon className="w-4 h-4" />
                                    ) : (
                                      <svg className="w-3 h-3 opacity-30" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </button>

                              {/* detail area — appears just below this card (confined to this cell) */}
                              <AnimatePresence initial={false} mode="wait">
                                {active && (
                                  <motion.div
                                    key={opt.value}
                                    initial={{ opacity: 0, height: 0, y: -5 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -5 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="mt-3 bg-white/60 p-3 rounded-md border-border overflow-hidden"
                                  >
                                    {opt.value === "flat" && (
                                      <div className="flex flex-wrap justify-start gap-3 items-center">
                                        <FormField
                                          control={form.control}
                                          name="discountPercentage"
                                          render={({ field: pField }) => (
                                            <FormItem className="w-32 md:w-40">
                                              <FormControl>
                                                <Input
                                                  type="number"
                                                  placeholder="Discount %"
                                                  className="text-base py-2"
                                                  {...pField}
                                                  onChange={(e) =>
                                                    pField.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                                                  }
                                                />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="discountInKwd"
                                          render={({ field: kField }) => (
                                            <FormItem className="w-40 md:w-48">
                                              <FormControl>
                                                <Input
                                                  type="text"
                                                  placeholder="Discount (KWD)"
                                                  readOnly
                                                  className="text-base py-2 bg-muted/50"
                                                  {...kField}
                                                />
                                              </FormControl>
                                            </FormItem>
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
                                            <FormItem>
                                              <FormControl>
                                                <Input
                                                  placeholder="Reference Code"
                                                  className="text-base py-2 w-full"
                                                  {...rField}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <div className="flex flex-wrap gap-3">
                                          {/* kept unbound to preserve original logic */}
                                          <Input placeholder="Discount %" className="w-32 md:w-40 text-base py-2" />
                                          <Input placeholder="Discount (KWD)" className="w-40 md:w-48 text-base py-2" />
                                        </div>
                                      </div>
                                    )}

                                    {opt.value === "loyalty" && (
                                      <div className="flex flex-wrap gap-3 items-center">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          className="border-border bg-accent/40 hover:bg-accent/60 text-base py-2 rounded-lg"
                                        >
                                          Check Loyalty
                                        </Button>
                                        <Input placeholder="Discount %" className="w-32 md:w-40 text-base py-2" />
                                        <Input placeholder="Discount (KWD)" className="w-40 md:w-48 text-base py-2" />
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Info Message */}
              <div className="text-destructive italic text-sm md:text-base text-center bg-destructive/10 rounded-md py-3 mt-6">
                Only one discount can be applied. No discounts on Installments.
              </div>
            </div>
          </div>

          {/* Section 3: Charges Summary */}
          <div className="rounded-lg border p-8 space-y-2 bg-muted text-lg">
            <h3 className="text-2xl font-bold mb-4">Charges Summary</h3>
            {optional && (
              <div className="italic text-muted-foreground mb-4 border-b border-b-black pb-2">
                <div className="flex justify-between">
                  <span>Fabric Charges</span>

                  <span>{(charges?.fabric || 0).toFixed(2)} KWD</span>
                </div>
                <div className="flex justify-between">
                  <span>Stitching Charges</span>
                  <span>{(charges?.stitching || 0).toFixed(2)} KWD</span>
                </div>
                <div className="flex justify-between">
                  <span>Style Charges</span>
                  <span>{(charges?.style || 0).toFixed(2)} KWD</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{(charges?.delivery || 0).toFixed(2)} KWD</span>
                </div>
                <div className="flex justify-between">
                  <span>Shelf</span>
                  <span>{(charges?.shelf || 0).toFixed(2)} KWD</span>
                </div>
              </div>
            )}
            <div className={cn("flex justify-between font-semibold", "text-purple-600")}>
              <span>Total Due</span>
              <span>{totalDue.toFixed(2)} KWD</span>
            </div>
            <div className={cn("flex justify-between font-semibold", "text-green-600")}>
              <span>Discount</span>
              <span>{discountValue.toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Advance</span>
              <span>{( balance < 0 ? advance + balance : advance).toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Balance</span>
              <span>{ balance < 0 ? 0 : balance.toFixed(2)} KWD</span>
            </div>
          </div>
        </div>

        {/* Footer: bottom-right aligned Proceed button */}
        <div className="pt-2">
          <div className="flex justify-end">
            <Button type="button" onClick={handleProceed}>
              Proceed
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}