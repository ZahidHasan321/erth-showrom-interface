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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Customer</DialogTitle>
        </DialogHeader>
        {customers.map((customer, index) => (
          <DialogDescription
            key={customer.id}
            onClick={() => handleSelect(customer)}
            className={`p-2 border rounded-lg hover:bg-muted cursor-pointer flex flex-col ${
              selectedIndex === index ? "border-primary border-2" : ""
            }`}
          >
            <span className="font-medium">{customer.fields.Name}</span>
            {customer.fields.City && (
              <span className="text-xs text-muted-foreground">
                <strong>City:</strong> {customer.fields.City}
              </span>
            )}
            {customer.fields.Relation && (
              <span className="text-xs text-muted-foreground">
                <strong>Relation:</strong> {customer.fields.Relation}
              </span>
            )}
            {customer.fields.AccountType && (
              <span className="text-xs text-muted-foreground">
                <strong>Account Type:</strong> {customer.fields.AccountType}
              </span>
            )}
          </DialogDescription>
        ))}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
