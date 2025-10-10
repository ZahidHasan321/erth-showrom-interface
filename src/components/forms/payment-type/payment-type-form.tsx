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
import type { UseFormReturn } from "react-hook-form";
import { type PaymentTypeSchema } from "./schema";

import KNetLogo from "@/assets/payment-assets/knet.png";
import CashIcon from "@/assets/payment-assets/cash.png";
import LinkPaymentIcon from "@/assets/payment-assets/linkPayment.png";
import InstallmentsIcon from "@/assets/payment-assets/installments.png";

interface PaymentTypeFormProps {
  form: UseFormReturn<PaymentTypeSchema>;
  onSubmit: (values: PaymentTypeSchema) => void;
}

export function PaymentTypeForm({ form, onSubmit }: PaymentTypeFormProps) {
  const paymentType = form.watch("paymentType");

  const paymentOptions = [
    { value: "k-net", label: "K-Net", img: KNetLogo },
    { value: "cash", label: "Cash", img: CashIcon },
    { value: "link-payment", label: "Link Payment", img: LinkPaymentIcon },
    { value: "installments", label: "Installments", img: InstallmentsIcon },
    { value: "others", label: "Others", icon: "🧾" },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-6 w-full"
      >
        {/* Left Section — Payment Types */}
        <div className="flex-1 bg-gray-100 p-6 rounded-xl">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-4">Payment Type</h1>
        </div>

          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6"
                  >
                    {paymentOptions.map((option) => (
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
                            <span className="text-4xl">{option.icon}</span>
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

          {/* Show "Others" input only if selected */}
          {paymentType === "others" && (
            <div className="mt-6">
              <FormField
                control={form.control}
                name="otherPaymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please Specify</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Right Section — Actions */}
        <div className="flex flex-col justify-between bg-gray-100 p-4 rounded-xl w-full md:w-64 space-y-4">
          <FormField
            control={form.control}
            name="paymentRefNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Payment Ref. No.</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reference no." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Confirm Order
            </Button>
            <Button type="button" variant="secondary">
              Print Invoice
            </Button>
            <Button type="button" variant="destructive">
              Cancel Order
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}