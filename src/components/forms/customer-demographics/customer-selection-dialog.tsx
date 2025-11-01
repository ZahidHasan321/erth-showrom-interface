"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";
import { toast } from "sonner";

interface CustomerSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerSelectionDialog({
  isOpen,
  onOpenChange,
  customers,
  onSelectCustomer,
}: CustomerSelectionDialogProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
    onOpenChange(false); // Close dialog after selection
    toast.success(`Selected ${customer.fields.Name}`);
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0); // Reset index when dialog opens
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % customers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + customers.length) % customers.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(customers[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, customers, selectedIndex, handleSelect]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Select a Customer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Multiple customers found. Please select one to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 my-4">
          {customers.map((customer, index) => (
            <div
              key={customer.id}
              onClick={() => handleSelect(customer)}
              className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col gap-2 ${
                selectedIndex === index
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-accent/10"
              }`}
            >
              <span className="font-semibold text-lg text-foreground">
                {customer.fields.Name}
              </span>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {customer.fields.City && (
                  <span className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">City:</span>{" "}
                    {customer.fields.City}
                  </span>
                )}
                {customer.fields.Relation && (
                  <span className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Relation:</span>{" "}
                    {customer.fields.Relation}
                  </span>
                )}
                {customer.fields.AccountType && (
                  <span className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Account Type:</span>{" "}
                    {customer.fields.AccountType}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
