import { type Path, type UseFormReturn } from "react-hook-form";
import { MeasurementInput } from "./MeasurementInput";
import type { CustomerMeasurementsSchema } from "./schema";
import { cn } from "@/lib/utils";

interface GroupedMeasurementFieldsProps {
  form: UseFormReturn<CustomerMeasurementsSchema>;
  title: string;
  unit: string;
  isDisabled: boolean;
  fields: Array<
    |
      {
        name: string;
        label: string;
        className?: string;
        labelClassName?: string;
        isDisabled?: boolean;
      }
    |
      Array<{
        name: string;
        label: string;
        className?: string;
        labelClassName?: string;
        isDisabled?: boolean;
      }>
  >;
  wrapperClassName?: string;
}

export function GroupedMeasurementFields({
  form,
  title,
  unit,
  isDisabled,
  fields,
  wrapperClassName,
}: GroupedMeasurementFieldsProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 shadow-sm", wrapperClassName)}>
      <h4 className="text-lg font-semibold mb-4 text-foreground">{title}</h4>
      <div className="flex flex-col gap-y-4">
        {fields.map((fieldOrFieldGroup, index) => {
          if (Array.isArray(fieldOrFieldGroup)) {
            return (
              <div key={index} className="flex flex-wrap w-fit gap-x-12 border border-border p-3 rounded-lg bg-card">
                {fieldOrFieldGroup.map((fieldConfig) => (
                  <MeasurementInput
                    key={fieldConfig.name}
                    form={form}
                    name={fieldConfig.name as Path<CustomerMeasurementsSchema>}
                    label={fieldConfig.label}
                    unit={unit}
                    isDisabled={isDisabled || (fieldConfig.isDisabled ?? false)}
                    className={cn( fieldConfig.className )}
                    labelClassName={fieldConfig.labelClassName}
                  />
                ))}
              </div>
            );
          }

          const fieldConfig = fieldOrFieldGroup;

          return (
            <MeasurementInput
              key={fieldConfig.name}
              form={form}
              name={fieldConfig.name as Path<CustomerMeasurementsSchema>}
              label={fieldConfig.label}
              unit={unit}
              isDisabled={isDisabled || (fieldConfig.isDisabled ?? false)}
              className={cn( fieldConfig.className, "border border-border p-3 rounded-lg w-fit bg-card" )}
              labelClassName={fieldConfig.labelClassName}
            />
          );
        })}
      </div>
    </div>
  );
}