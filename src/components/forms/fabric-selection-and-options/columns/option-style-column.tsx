import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type FabricSelection } from "@/types/fabric";

export const optionStyleColumn: ColumnDef<FabricSelection>[] = [
  {
    header: "Option/Style",
    id: "option-style",
    columns: [
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => {
                // Implement copy previous logic
                console.log("Copying previous row", row.index - 1);
              }}
            >
              Copy Previous
            </Button>
          </div>
        ),
      },
    ],
  },
];
