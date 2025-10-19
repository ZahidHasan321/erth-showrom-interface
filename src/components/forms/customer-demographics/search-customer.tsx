"use client";

import { searchCustomerByPhone } from "@/api/customers";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomerSelectionDialog } from "./customer-selection-dialog";

interface SearchCustomerProps {
  onCustomerFound: (customer: Customer) => void;
  onHandleClear: () => void;
}

export function SearchCustomer({ onCustomerFound, onHandleClear }: SearchCustomerProps) {
  const [searchMobile, setSearchMobile] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);

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
  };

  const handleSearch = () => {
    setSubmittedSearch(searchMobile);
  };

  const handleClear = () => {
    setSearchMobile("");
    setSubmittedSearch(null);
    onHandleClear();
  };

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

      <CustomerSelectionDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        customers={customerOptions}
        onSelectCustomer={handleSelectCustomer}
      />
    </div>
  );
}
