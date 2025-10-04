import { getCustomerById, searchCustomerByPhone } from "@/api/customers";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/types/customer";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SearchCustomerProps {
  onCustomerFound: (customer: Customer) => void;
  customerType: "New" | "Existing";
}

export function SearchCustomer({ onCustomerFound, customerType }: SearchCustomerProps) {
  const [searchMobile, setSearchMobile] = useState("");
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState<{ term: string; type: "phone" | "id" } | null>(null);

  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: ["customerSearch", submittedSearch],
    queryFn: async () => {
      if (!submittedSearch) return null;
      if (submittedSearch.type === "id") {
        return getCustomerById(submittedSearch.term);
      } else {
        return searchCustomerByPhone(submittedSearch.term);
      }
    },
    enabled: !!submittedSearch,
    retry: false, // Don't retry on failure, as "not found" is a valid outcome
  });

  useEffect(() => {
    if (isSuccess && data) {
      if (data.data) {
        onCustomerFound(data.data as Customer);
        toast.success("Customer found!");
      } else {
        toast.error("Customer not found.");
      }
    }
  }, [isSuccess, data, onCustomerFound]);

  useEffect(() => {
    if (isError) {
      toast.error(error.message || "Failed to search for customer.");
      console.error("Error searching for customer:", error);
    }
  }, [isError, error]);

  const handleSearch = () => {
    if (searchCustomerId) {
      setSubmittedSearch({ term: searchCustomerId, type: "id" });
    } else if (searchMobile) {
      setSubmittedSearch({ term: searchMobile, type: "phone" });
    } else {
      toast.warning("Please enter a Customer ID or Mobile Number to search.");
    }
  };

  const handleClear = () => {
    setSearchMobile("");
    setSearchCustomerId("");
    setSubmittedSearch(null);
  };

  if (customerType !== "Existing") {
    return null;
  }

  return (
    <div className="bg-muted p-4 rounded-lg space-y-4">
      <h2 className={"text-xl font-semibold"}>Search Customer</h2>
      <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"}>
        <FormItem>
          <FormLabel>Customer ID</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter customer ID..."
              value={searchCustomerId}
              onChange={(e) => setSearchCustomerId(e.target.value)}
              className="bg-white"
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Mobile Number</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter mobile number..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="bg-white"
            />
          </FormControl>
        </FormItem>

        <div className="flex gap-2 flex-wrap justify-end lg:col-span-2">
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isFetching}
          >
            <SearchIcon className="w-4 h-4 mr-2" />
            {isFetching ? "Searching..." : "Search Customer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            Clear Search
          </Button>
        </div>
      </div>
    </div>
  );
}
