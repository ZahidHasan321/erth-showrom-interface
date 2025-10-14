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
import { cn } from "@/lib/utils";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { type PaymentTypeSchema } from "./schema";
import { motion, AnimatePresence } from "framer-motion";

import KNetLogo from "@/assets/payment-assets/knet.png";
import CashIcon from "@/assets/payment-assets/cash.png";
import LinkPaymentIcon from "@/assets/payment-assets/linkPayment.png";
import InstallmentsIcon from "@/assets/payment-assets/installments.png";

interface PaymentTypeFormProps {
  form: UseFormReturn<PaymentTypeSchema>;
  onSubmit: (values: PaymentTypeSchema) => void;
}

export function PaymentTypeForm({ form, onSubmit }: PaymentTypeFormProps) {
  const paymentType = useWatch({ control: form.control, name: "paymentType" });

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
        className="flex flex-col md:flex-row gap-6 w-full p-4 max-w-7xl"
      >
        {/* Left Section — Payment Types */}
        <motion.div
          layout
          transition={{ layout: { type: "spring", stiffness: 220, damping: 28 } }}
          className="flex-1 bg-muted p-6 rounded-xl"
        >
          <h1 className="text-2xl font-bold mb-4">Payment Type</h1>

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
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.3 } }}
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
                            <Input placeholder="Enter payment type" {...field} />
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
          className="flex flex-col justify-between bg-muted p-4 rounded-xl w-full md:w-64 space-y-4"
          transition={{ layout: { type: "spring", stiffness: 220, damping: 28 } }}
        >
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

          <motion.div layout className="flex flex-col gap-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Confirm Order
            </Button>
            <Button type="button" variant="secondary">
              Print Invoice
            </Button>
            <Button type="button" variant="destructive">
              Cancel Order
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}