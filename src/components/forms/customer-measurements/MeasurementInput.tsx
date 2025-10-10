import { type UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface MeasurementInputProps {
  form: UseFormReturn<any>; // Use any for now, will refine with schema later
  name: string;
  label: string;
  unit: string;
  isDisabled: boolean;
  className?: string; // For custom styling of the outer div
  labelClassName?: string; // For custom styling of the FormLabel
}

export function MeasurementInput({
  form,
  name,
  label,
  unit,
  isDisabled,
  className,
  labelClassName,
}: MeasurementInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center gap-2 justify-between">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : parseFloat(value));
                  }}
                  className="w-20 bg-white"
                  disabled={isDisabled}
                />
                <span className="absolute right-2 text-gray-500 pointer-events-none">
                  {unit}
                </span>
              </div>
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}
