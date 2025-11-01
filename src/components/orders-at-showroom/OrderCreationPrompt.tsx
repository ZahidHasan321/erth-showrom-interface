import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

type OrderCreationPromptProps = {
  orderType: "Work Order" | "Sales Order";
  isPending: boolean;
  onCreateOrder: () => void;
  dialogState: {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  };
  onCloseDialog: () => void;
};

export function OrderCreationPrompt({
  orderType,
  isPending,
  onCreateOrder,
  dialogState,
  onCloseDialog,
}: OrderCreationPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <h2 className="text-2xl font-semibold">No order created yet 📝</h2>
      <p className="text-gray-600 dark:text-gray-400">
        You need to create a new {orderType.toLowerCase()} before proceeding.
      </p>

      <Button size="lg" onClick={onCreateOrder} disabled={isPending}>
        {isPending ? "Creating..." : `Create New ${orderType}`}
      </Button>

      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={onCloseDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        description={dialogState.description}
      />
    </div>
  );
}
