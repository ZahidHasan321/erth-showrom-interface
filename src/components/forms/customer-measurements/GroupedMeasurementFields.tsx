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
    <div className={`bg-card border rounded-lg p-4 ${wrapperClassName}`}>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <div className="flex flex-col gap-y-4">
        {fields.map((fieldOrFieldGroup, index) => {
          if (Array.isArray(fieldOrFieldGroup)) {
            return (
              <div key={index} className="flex flex-wrap w-fit shadow hover:shadow-lg gap-x-12 border p-2 rounded-md">
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
              className={cn( fieldConfig.className, "border shadow p-2 rounded-lg w-fit hover:shadow-lg" )}
              labelClassName={fieldConfig.labelClassName}
            />
          );
        })}
      </div>
    </div>
  );
}