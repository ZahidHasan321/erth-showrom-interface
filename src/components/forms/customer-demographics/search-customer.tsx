"use client";

import { searchCustomerByPhone } from "@/api/customers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SearchCustomerProps {
  onCustomerFound: (customer: Customer) => void;
  onHandleClear: () => void;
}

export function SearchCustomer({ onCustomerFound, onHandleClear }: SearchCustomerProps) {
  const [searchMobile, setSearchMobile] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: ["customerSearch", submittedSearch],
    queryFn: async () => {
      if (!submittedSearch) return null;
      return searchCustomerByPhone(submittedSearch);
    },
    enabled: !!submittedSearch,
    staleTime: 0, // Data is immediately stale
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      if (data.data) {
        if (data.count === 1) {
          onCustomerFound(data.data[0] as Customer);
          toast.success("Customer found!");
        } else if (data.count && data.count > 1) {
          setCustomerOptions(data.data);
          setShowDialog(true);
          setSelectedIndex(0); // Reset index when dialog opens
          toast.info("Multiple customers found. Please select one.");
        } else {
          toast.error("Customer not found.");
        }
      }
    }
  }, [isSuccess, data, onCustomerFound]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message || "Failed to search for customer.");
      console.error("Error searching for customer:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    return () => {
      setSubmittedSearch(null);
      setSearchMobile("");
    };
  }, []);

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerFound(customer);
    setShowDialog(false);
    setCustomerOptions([]);
    setSubmittedSearch(null);
    toast.success(`Selected ${customer.fields.Name}`);
  };

  const handleSearch = () => {
    setSubmittedSearch(searchMobile);
  };

  const handleClear = () => {
    setSearchMobile("");
    setSubmittedSearch(null);
    onHandleClear();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDialog) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % customerOptions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + customerOptions.length) % customerOptions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelectCustomer(customerOptions[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showDialog, customerOptions, selectedIndex, handleSelectCustomer]);

  return (
    <div
      className="bg-muted p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">Search Customer</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <FormItem>
          <FormLabel>Mobile Number</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter mobile number..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="bg-white"
              name="customerSearchMobile"    // important — stable name
              type="tel"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="on"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </FormControl>
        </FormItem>

        <div className="flex gap-2 flex-wrap justify-end lg:col-span-2">
          <Button
            type="button"
            disabled={isFetching}
            className="flex items-center"
            onClick={handleSearch}
          >
            <SearchIcon className="w-4 h-4 mr-2" />
            {isFetching ? "Searching..." : "Search Customer"}
          </Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear Search
          </Button>
        </div>
      </div>

      {/* Dialog for multiple customers */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select a Customer</DialogTitle>
          </DialogHeader>
          {customerOptions.map((customer, index) => (
            <DialogDescription
              key={customer.id}
              onClick={() => handleSelectCustomer(customer)}
              className={`p-2 border rounded-lg hover:bg-muted cursor-pointer flex flex-col ${selectedIndex === index ? "border-primary border-2" : ""
                }`}>
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
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}