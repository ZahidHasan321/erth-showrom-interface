import { type UseFormReturn } from "react-hook-form";
import { MeasurementInput } from "./MeasurementInput";

interface GroupedMeasurementFieldsProps {
  form: UseFormReturn<any>;
  title: string;
  unit: string;
  isDisabled: boolean;
  fields: Array<{
    name: string;
    label: string;
    className?: string; // For custom styling of the individual MeasurementInput
    labelClassName?: string; // For custom styling of the individual MeasurementInput's label
  }>;
  wrapperClassName?: string; // For custom styling of the outer div (e.g., positioning)
  forceColumn?: boolean; // New prop
}

export function GroupedMeasurementFields({
  form,
  title,
  unit,
  isDisabled,
  fields,
  wrapperClassName,
  forceColumn,
}: GroupedMeasurementFieldsProps) {
  let containerClasses = "flex";

  if (!forceColumn) {
    containerClasses += " flex-row gap-x-2";
  } else if (forceColumn) {
    containerClasses += " flex-col gap-y-2";
  } else {
    // fields.length > 2
    containerClasses += "flex-col gap-y-0";
  }

  return (
    <div
      className={`w-[200px] border border-1 rounded-lg p-2 ${wrapperClassName}`}
    >
      <h4 className="font-bold mb-2">{title}</h4>
      <div className={containerClasses}>
        {fields.map((fieldConfig) => (
          <MeasurementInput
            key={fieldConfig.name}
            form={form}
            name={fieldConfig.name}
            label={fieldConfig.label}
            unit={unit}
            isDisabled={isDisabled}
            className={fieldConfig.className}
            labelClassName={fieldConfig.labelClassName}
          />
        ))}
      </div>
    </div>
  );
}
