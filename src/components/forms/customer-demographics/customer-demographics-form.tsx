import { searchPrimaryAccountByPhone, upsertCustomer } from "@/api/customers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSortedCountries } from "@/lib/countries";
import {
  mapCustomerToFormValues,
  mapFormValuesToCustomer,
} from "@/lib/customer-mapper";
import type { Customer } from "@/types/customer";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { flushSync } from "react-dom";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import {
  customerDemographicsDefaults,
  customerDemographicsSchema,
  type CustomerDemographicsSchema,
} from "./schema";
import { SearchCustomer } from "./search-customer";
import { AnimatedMessage } from "@/components/animation/AnimatedMessage";

interface CustomerDemographicsFormProps {
  form: UseFormReturn<z.infer<typeof customerDemographicsSchema>>;
  onSubmit: (values: z.infer<typeof customerDemographicsSchema>) => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onCustomerRecordChange?: (id: string|null) => void,
  onCustomerIdChange?: (id: string|null) => void;
  onProceed?: () => void;
  onClear?: () => void;
}

export function CustomerDemographicsForm({
  form,
  onSubmit,
  onEdit,
  onCancel,
  onCustomerIdChange,
  onCustomerRecordChange,
  onProceed,
  onClear
}: CustomerDemographicsFormProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [ customerId, setCustomerId ] = useState<string | null>(null);
  const [customerRecordId, setCustomerRecordId] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });
  const [warnings, setWarnings] = React.useState<{ [K in keyof CustomerDemographicsSchema]?: string }>({});

  const AccountType = form.watch("accountType")
  const mobileNumber = form.watch("mobileNumber")
  const countries = React.useMemo(() => getSortedCountries(), []);

  const { data: existingUsers, isSuccess, refetch: accountRefetch, isFetching } = useQuery({
    queryKey: ['existingUsers'],
    queryFn: async () => { return searchPrimaryAccountByPhone(mobileNumber) },
    enabled: false
  })

  function handleMobileChange() {
    if (mobileNumber === undefined || mobileNumber.trim() === "" || !isEditing) {
      setWarnings((prev) => ({ ...prev, mobileNumber: undefined }));
      form.setValue("accountType", undefined);
      return;
    }
    accountRefetch();
  }

  React.useEffect(() => {
    if (isSuccess && existingUsers) {
      const currentAccountType = form.getValues().accountType;
      if (existingUsers.data && existingUsers.count && existingUsers.count > 0 && existingUsers.data[0].id !== customerRecordId) {
        setWarnings((prev) => ({
          ...prev,
          mobileNumber: "This mobile number is already used in a Primary account. Proceed with caution.",
        }));
        if (currentAccountType !== "Secondary") {
          form.setValue("accountType", "Secondary");
        }
      } else {
        setWarnings((prev) => ({ ...prev, mobileNumber: undefined }));
        if (currentAccountType !== "Primary") {
          form.setValue("accountType", "Primary");
        }
      }
    }
  }, [existingUsers, isSuccess, mobileNumber, form])




  const handleCustomerFound = React.useCallback(
    (customer: Customer) => {
      const formValues = mapCustomerToFormValues(customer);
      form.reset(formValues);
      setCustomerRecordId(customer.id);
      setCustomerId(String(customer.fields.id) || null);
      setIsEditing(false);
    },
    [form]
  );

    React.useEffect(() => {
      onCustomerRecordChange?.(customerRecordId);
      onCustomerIdChange?.(customerId)
  }, [customerRecordId, customerId, onCustomerIdChange, onCustomerRecordChange]);


  const { mutate: upsertCustomerMutation, isPending: isUpserting } =
    useMutation({
      mutationFn: (customerToUpsert: {
        id?: string;
        fields: Partial<Customer["fields"]>;
      }) => upsertCustomer([customerToUpsert], ["Phone"]),
      onSuccess: (response) => {
        if (response.status === "success" && response.data) {
          const wasNewCustomer = !customerRecordId;
          toast.success(
            `Customer ${wasNewCustomer ? "created" : "updated"} successfully!`
          ); onProceed
          const upsertedCustomerData = response.data.records.at(0) as Customer;

          setCustomerRecordId(upsertedCustomerData.id);
          setCustomerId(upsertedCustomerData.fields.id?.toString() || null);

          flushSync(() => {
            setIsEditing(false);
          });
          onSubmit(form.getValues());
        } else {
          toast.error(
            response.message ||
            `Failed to ${customerRecordId ? "update" : "create"} customer.`
          );
        }
      },
      onError: () => {
        toast.error(
          `Failed to ${customerRecordId ? "update" : "create"} customer.`
        );
      },
    });

  const handleFormSubmit = (
    values: z.infer<typeof customerDemographicsSchema>
  ) => {
    const customerToUpsert = mapFormValuesToCustomer(values, customerRecordId);
    upsertCustomerMutation(customerToUpsert);
  };

  const handleEdit = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Edit",
      description: "Are you sure you want to edit this customer?",
      onConfirm: () => {
        setIsEditing(true);
        onEdit?.();
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const handleCancel = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Cancel",
      description:
        "Are you sure you want to cancel? Any unsaved changes will be lost.",
      onConfirm: () => {
        setIsEditing(false);
        onCancel?.();
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const handleSave = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Save",
      description: "Are you sure you want to save these details?",
      onConfirm: () => {
        form.handleSubmit(handleFormSubmit)();
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const isReadOnly = !isEditing;

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-8 w-full"
      >
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() =>
            setConfirmationDialog({ ...confirmationDialog, isOpen: false })
          }
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />

        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-4">Demographics</h1>
        </div>

        <SearchCustomer
          onCustomerFound={handleCustomerFound}
          onHandleClear={() => {
            form.reset(customerDemographicsDefaults);
            setCustomerRecordId(null);
            setCustomerId(null);
            setIsEditing(true);
            setWarnings({});
            onClear?.()
          }}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="bg-muted p-4 rounded-lg">
              <FormLabel className="font-bold">
                <span className="text-red-500">*</span>Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name (e.g., Nasser Al-Sabah)"
                  {...field}
                  className="bg-white"
                  readOnly={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nick Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter nickname (e.g., Abu Nasser)"
                      {...field}
                      className="bg-white"
                      readOnly={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Instagram handle (e.g., @erth)"
                      {...field}
                      className="bg-white"
                      readOnly={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOB</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    <span className="text-red-500">*</span>Mobile No
                  </FormLabel>
                  <div className="flex flex-col md:flex-row gap-2">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      disabled={isReadOnly}
                      render={({ field }) => (
                        <FormItem>
                          <Combobox
                            disabled={isReadOnly}
                            options={React.useMemo(() => countries.map((country) => ({
                              value: country.phoneCode,
                              label: `${country.flag}: ${country.name} ${country.phoneCode}`,
                            })), [countries])}
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Code"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormControl>
                      <Input
                        placeholder="Enter mobile number"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                        onBlur={handleMobileChange}
                      />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="bg-white"
                              disabled={isReadOnly}
                            />
                          </FormControl>
                          <FormLabel>WhatsApp</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />

                  <AnimatedMessage
                    info={isFetching ? "Checking existing accounts..." : undefined}
                    warning={warnings.mobileNumber && !isFetching && existingUsers?.count && existingUsers.count > 0 ? warnings.mobileNumber : undefined}
                  />

                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternativeMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Mobile No</FormLabel>
                  <div className="flex flex-col md:flex-row gap-2">
                    <FormField
                      control={form.control}
                      name="alternativeCountryCode"
                      render={({ field }) => (
                        <FormItem>
                                                <Combobox
                                                  disabled={isReadOnly}
                                                  options={React.useMemo(() => countries.map((country) => ({
                                                    value: country.phoneCode,
                                                    label: `${country.flag}: ${country.name} ${country.phoneCode}`,
                                                  })), [countries])}
                                                  value={field.value || ""}
                                                  onChange={field.onChange}
                                                  placeholder="Code"
                                                />                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormControl>
                      <Input
                        placeholder="Enter alternative mobile number"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name="whatsappOnAlt"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="bg-white"
                              disabled={isReadOnly}
                            />
                          </FormControl>
                          <FormLabel>WhatsApp</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    <span className="text-red-500">*</span>Nationality
                  </FormLabel>
                  <Combobox
                    disabled={isReadOnly}
                    options={React.useMemo(() => countries.map((country) => ({
                      value: country.name,
                      label: `${country.flag} ${country.name}`,
                    })), [countries])}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select nationality"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="bg-muted p-4 rounded-lg">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email (e.g., nasser@erth.com)"
                  {...field}
                  className="bg-white"
                  readOnly={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col rounded-lg bg-muted p-4 gap-4">
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="w-full bg-muted p-4">
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="Secondary">Secondary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem className="w-full bg-muted p-4">
                  <FormLabel>Account Relation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isReadOnly || AccountType === "Primary"}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder={AccountType === "Primary" ? "Account is primary" : "Select account type"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Son">Son</SelectItem>
                      <SelectItem value="Cousin">Cousin</SelectItem>
                      <SelectItem value="Brother">Brother</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="customerSegment"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel>Customer Segment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select customer segment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city name"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter area or locality"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Block</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter block number/name"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter street name"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House / Building no.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter house or building number"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address.addressNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any address details or delivery instructions"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="bg-muted p-4 rounded-lg">
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about the customer"
                  {...field}
                  className="bg-white"
                  readOnly={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6 justify-center">
          {!isEditing && customerRecordId && (
            <>
              <Button type="button" variant="outline" onClick={handleEdit}>
                Edit Details
              </Button>
              <Button
                type="button"
                onClick={onProceed}
                disabled={!customerRecordId}
              >
                Proceed
              </Button>
            </>
          )}
          {isEditing && customerRecordId && (
            <Button type="button" variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          {isEditing && (
            <Button type="submit" disabled={isUpserting}>
              {isUpserting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
