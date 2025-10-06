import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type FabricSelectionSchema } from "../schema";
import { useFormContext } from "react-hook-form";

export const optionStyleColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Option/Style",
    id: "option-style",
    columns: [
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const { getValues, setValue } = useFormContext();
          return (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={"outline"}
                onClick={() => {
                  if (row.index > 0) {
                    const prevRowValues = getValues(
                      `fabricSelections.${row.index - 1}`
                    );
                    const currentRowValues = getValues(
                      `fabricSelections.${row.index}`
                    );
                    setValue(`fabricSelections.${row.index}`, {
                      ...prevRowValues,
                      id: currentRowValues.id,
                    });
                  }
                }}
              >
                Copy Previous
              </Button>
            </div>
          );
        },
      },
    ],
  },
];
