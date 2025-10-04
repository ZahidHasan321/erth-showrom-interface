import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";

interface FabricReferenceInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  isDisabled: boolean;
}

export function FabricReferenceInput({ form, name, label, isDisabled }: FabricReferenceInputProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  const handleInputChange = (index: number, value: string) => {
    form.setValue(`${name}.${index}`, value); // Update the form value directly
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  // Access errors from formState
  const errors = form.formState.errors;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => {
              const fieldName = `${name}.${index}`;
              const fieldError = (errors[name] as any)?.[index]; // Access error for this specific field

              return (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...form.register(fieldName)}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent form submission
                        if (index === fields.length - 1 && e.currentTarget.value.trim() !== "") {
                          append("");
                        }
                      }
                    }}
                    placeholder={`Reference ${index + 1}`}
                    className={`flex-grow bg-white ${fieldError ? "border-red-500" : ""} ${index < fields.length - 1 ? "text-gray-500" : ""}`}
                    disabled={isDisabled}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    disabled={isDisabled}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              disabled={isDisabled}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" /> Add Reference
            </Button>
          </div>
        </FormItem>
      )}
    />
  );
}