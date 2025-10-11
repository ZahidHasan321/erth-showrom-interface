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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { orderTypeAndPaymentSchema } from "./schema";
import type { UseFormReturn } from "react-hook-form";
import React from "react";
import PickUpIcon from "@/assets/pickup.png";
import HomeDeliveryIcon from "@/assets/home_delivery.png";

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full p-4 max-w-7xl"
      >
        {/* Section 1: Order Type & Payment */}
        {optional && (
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Order Type & Payment</h3>
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
                            "flex flex-col items-center justify-center rounded-lg p-4 bg-white border hover:border-green-500 transition-all cursor-pointer",
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
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 2: Select Discount */}
          <div className="flex flex-col space-y-4">
            <div className="bg-blue-500 text-white p-2 rounded-t-lg">
              <h3 className="text-lg font-medium">Select Discount</h3>
            </div>
            <div className="bg-green-100 p-4 rounded-b-lg space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "flat"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "flat" : undefined)
                          }
                        />
                      </FormControl>
                      <FormLabel>Flat</FormLabel>
                    </FormItem>
                  )}
                />
                {discountType === "flat" && (
                  <div className="flex flex-row justify-center gap-4">
                    <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="discount %"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountInKwd"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="discount (in KWD)"
                              {...field}
                              readOnly
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div>
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value === "referral"}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? "referral" : undefined)
                            }
                          />
                        </FormControl>
                        <FormLabel>Referral</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                {discountType === "referral" && (
                  <div className="flex flex-row justify-center gap-4">
                    <FormField
                      control={form.control}
                      name="referralCode"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input placeholder="Reference Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Input placeholder="discount" />
                    <Input placeholder="discount(in KWD)" />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "loyalty"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "loyalty" : undefined)
                          }
                        />
                      </FormControl>
                      <FormLabel>Loyalty</FormLabel>
                    </FormItem>
                  )}
                />
                {discountType === "loyalty" && (
                  <div className="flex flex-row gap-4">
                    <Button type="button">Check Loyalty</Button>
                    <Input placeholder="discount" />
                    <Input placeholder="discount(in KWD)" />
                  </div>
                )}
              </div>
              <div className="text-red-500 italic text-sm">
                Only one discount can be applied. No discounts on Installments.
              </div>
            </div>
          </div>

          {/* Section 3: Charges Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="text-lg font-medium mb-4">Charges Summary</h3>
            {optional && (
              <>
                {" "}
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
                </div>{" "}
              </>
            )}
            <div
              className={cn("flex justify-between font-bold", "text-purple-600")}
            >
              <span>Total Due</span>
              <span>{totalDue.toFixed(2)} KWD</span>
            </div>
            <div
              className={cn("flex justify-between font-bold", "text-green-600")}
            >
              <span>Discount</span>
              <span>{discountValue.toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Advance</span>
              <span>{(advance || 0).toFixed(2)} KWD</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Balance</span>
              <span>{balance.toFixed(2)} KWD</span>
            </div>
          </div>
        </div>

        <Button type="button" onClick={handleProceed}>
          Proceed
        </Button>
      </form>
    </Form>
  );
}
