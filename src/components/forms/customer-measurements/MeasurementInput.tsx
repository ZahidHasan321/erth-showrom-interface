import { type UseFormReturn, type Path } from "react-hook-form";
import { forwardRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CustomerMeasurementsSchema } from "./schema";

interface MeasurementInputProps {
  form: UseFormReturn<CustomerMeasurementsSchema>;
  name: Path<CustomerMeasurementsSchema>;
  label: string;
  unit: string;
  isDisabled: boolean;
  className?: string; // For custom styling of the outer div
  labelClassName?: string; // For custom styling of the FormLabel
  onEnterPress?: () => void; // Callback for Enter key press
}

export const MeasurementInput = forwardRef<HTMLInputElement, MeasurementInputProps>(
  function MeasurementInput(
    {
      form,
      name,
      label,
      unit,
      isDisabled,
      className,
      labelClassName,
      onEnterPress,
    },
    ref
  ) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          const { ref: fieldRef, ...fieldProps } = field;
          return (
            <FormItem className={className}>
              <div className="flex items-center gap-4 flex-nowrap">
                <FormLabel className={labelClassName}>{label}</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      ref={(element) => {
                        // Call both refs
                        fieldRef(element);
                        if (typeof ref === 'function') {
                          ref(element);
                        } else if (ref) {
                          ref.current = element;
                        }
                      }}
                      type="number"
                      step="0.01"
                      {...fieldProps}
                      value={
                        typeof field.value === "number"
                          ? field.value === 0
                            ? ""
                            : field.value
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 0 : parseFloat(value));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onEnterPress?.();
                        }
                      }}
                      className="w-20 bg-white border-black pr-7 focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                      disabled={isDisabled}
                      placeholder="xx"
                    />
                    <span className="absolute right-2 text-gray-500 pointer-events-none">
                      {unit}
                    </span>
                  </div>
                </FormControl>
              </div>
            </FormItem>
          );
        }}
      />
    );
  }
);
