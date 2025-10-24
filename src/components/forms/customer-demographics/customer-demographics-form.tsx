import { debounce } from "@/lib/utils";
import {
  createCustomer,
  searchPrimaryAccountByPhone,
  updateCustomer,
} from "@/api/customers";
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
import { useWatch, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  customerDemographicsDefaults,
  customerDemographicsSchema,
  type CustomerDemographicsSchema,
} from "./schema";
import { SearchCustomer } from "./search-customer";
import { AnimatedMessage } from "@/components/animation/AnimatedMessage";
import WhatsappLogo from "@/assets/whatsapp.svg";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/global/error-boundary";

interface CustomerDemographicsFormProps {
  form: UseFormReturn<z.infer<typeof customerDemographicsSchema>>;
  onEdit?: () => void;
  onCancel?: () => void;
  onProceed?: () => void;
  onClear?: () => void;
  onSave?: (data: Partial<CustomerDemographicsSchema>) => void;
}

export function CustomerDemographicsForm({
  form,
  onEdit,
  onCancel,
  onProceed,
  onClear,
  onSave,
}: CustomerDemographicsFormProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  const [warnings, setWarnings] = React.useState<{
    [K in keyof CustomerDemographicsSchema]?: string;
  }>({});

  const [AccountType, mobileNumber, customerRecordId] = useWatch({
    control: form.control,
    name: ["accountType", "mobileNumber", "customerRecordId"],
  });
  const countries = getSortedCountries();

  const {
    data: existingUsers,
    isSuccess,
    refetch: accountRefetch,
    isFetching,
  } = useQuery({
    queryKey: ["existingUsers", mobileNumber],
    queryFn: async () => {
      return searchPrimaryAccountByPhone(mobileNumber);
    },
    enabled: false,
  });

  const debouncedRefetch = debounce(() => {
    accountRefetch();
  }, 500);

  function handleMobileChange(value: string) {
    if (value.trim() === "" || !isEditing) {
      setWarnings((prev) => ({ ...prev, mobileNumber: undefined }));
      form.setValue("accountType", undefined);
      return;
    }
    debouncedRefetch();
  }

  React.useEffect(() => {
    if (isSuccess && existingUsers) {
      const currentAccountType = form.getValues().accountType;
      if (
        existingUsers.data &&
        existingUsers.data.length > 0 &&
        existingUsers.count &&
        existingUsers.count > 0 &&
        existingUsers.data[0].id !== customerRecordId
      ) {
        setWarnings((prev) => ({
          ...prev,
          mobileNumber:
            "This mobile number is already used in a Primary account. Proceed with caution.",
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
  }, [existingUsers, isSuccess, mobileNumber, form, customerRecordId]);

  React.useEffect(() => {
    if (AccountType === "Primary") {
      form.setValue("relation", undefined);
    }
  }, [AccountType, form]);

  const handleCustomerFound = (customer: Customer) => {
    const formValues = mapCustomerToFormValues(customer);
    onSave?.(formValues);
    setTimeout(() => {
      setIsEditing(false);
    }, 0);
    setWarnings({});
    form.reset(formValues);
  };

  const { mutate: createCustomerMutation, isPending: isCreating } = useMutation(
    {
      mutationFn: (customerToCreate: Partial<Customer["fields"]>) =>
        createCustomer(customerToCreate),
      onSuccess: (response) => {
        if (response.status === "success" && response.data) {
          toast.success("Customer created successfully!");
          const createdCustomer = mapCustomerToFormValues(response.data);
          onSave?.(createdCustomer);
          form.reset(createdCustomer);
          setTimeout(() => {
            setIsEditing(false);
          }, 0);
        } else {
          toast.error(response.message || "Failed to create customer.");
        }
      },
      onError: () => {
        toast.error("Failed to create customer.");
      },
    }
  );

  const { mutate: updateCustomerMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: (customerToUpdate: {
        id: string;
        fields: Partial<Customer["fields"]>;
      }) => updateCustomer(customerToUpdate.id, customerToUpdate.fields),
      onSuccess: (response) => {
        if (response.status === "success" && response.data) {
          toast.success("Customer updated successfully!");
          const customer = mapCustomerToFormValues(response.data);
          onSave?.(customer);
          form.reset(customer);
          setTimeout(() => {
            setIsEditing(false);
          }, 0);
        } else {
          toast.error(response.message || "Failed to update customer.");
        }
      },
      onError: () => {
        toast.error("Failed to update customer.");
      },
    }
  );

  const handleFormSubmit = (
    values: z.infer<typeof customerDemographicsSchema>
  ) => {
    const onConfirm = () => {
      const customerToSave = mapFormValuesToCustomer(values, customerRecordId);
      if (customerRecordId) {
        updateCustomerMutation({ ...customerToSave, id: customerRecordId });
      } else {
        createCustomerMutation(customerToSave.fields);
      }
      setConfirmationDialog({ ...confirmationDialog, isOpen: false });
    };

    setConfirmationDialog({
      isOpen: true,
      title: customerRecordId ? "Update Customer" : "Create Customer",
      description: `Are you sure you want to ${
        customerRecordId ? "update" : "create"
      } this customer?`,
      onConfirm,
    });
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

  const handleCancelEdit = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Cancel",
      description:
        "Are you sure you want to cancel editing? Any unsaved changes will be lost.",
      onConfirm: () => {
        setIsEditing(false); // This will show the original customer data
        onCancel?.();
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const handleCancelCreation = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Cancel",
      description:
        "Are you sure you want to cancel creating a new customer? The form will be cleared.",
      onConfirm: () => {
        form.reset(customerDemographicsDefaults);
        setWarnings({});
        onClear?.();
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const isReadOnly = !isEditing;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Form {...form}>
      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={form.handleSubmit(handleFormSubmit)}
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

        <motion.div
          variants={itemVariants}
          className="flex justify-between items-start"
        >
          <h1 className="text-2xl font-bold mb-4">Demographics</h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ErrorBoundary fallback={<div>Search Customer crashed</div>}>
            <SearchCustomer
              onCustomerFound={handleCustomerFound}
              onHandleClear={() => {
                form.reset(customerDemographicsDefaults);
                setIsEditing(true);
                setWarnings({});
                onClear?.();
              }}
            />
          </ErrorBoundary>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ErrorBoundary fallback={<div>Name field crashed</div>}>
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
          </ErrorBoundary>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <ErrorBoundary fallback={<div>Nickname crashed</div>}>
              <FormField
                control={form.control}
                name="nickName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      <span className="text-red-500">*</span>
                      Nick Name
                    </FormLabel>
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
            </ErrorBoundary>
            <ErrorBoundary fallback={<div>Instagram crashed</div>}>
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
            </ErrorBoundary>
            <ErrorBoundary fallback={<div>DOB crashed</div>}>
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
            </ErrorBoundary>
          </div>

          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <ErrorBoundary fallback={<div>Mobile number crashed</div>}>
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
                          <FormItem className="min-w-42">
                            <Combobox
                              disabled={isReadOnly}
                              options={countries.map((country) => ({
                                value: country.phoneCode,
                                label: `${country.flag}: ${country.name} ${country.phoneCode}`,
                              }))}
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
                          onChange={(e) => {
                            field.onChange(e);
                            handleMobileChange(e.target.value);
                          }}
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
                            <FormLabel>
                              <img
                                src={WhatsappLogo}
                                alt="WhatsApp"
                                className="min-w-8"
                              />
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />

                    <AnimatedMessage
                      info={
                        isFetching ? "Checking existing accounts..." : undefined
                      }
                      warning={
                        warnings.mobileNumber &&
                        !isFetching &&
                        existingUsers?.count &&
                        existingUsers.count > 0
                          ? warnings.mobileNumber
                          : undefined
                      }
                    />
                  </FormItem>
                )}
              />
            </ErrorBoundary>
            <ErrorBoundary
              fallback={<div>Alternative mobile number crashed</div>}
            >
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
                          <FormItem className="min-w-42">
                            <Combobox
                              disabled={isReadOnly}
                              options={countries.map((country) => ({
                                value: country.phoneCode,
                                label: `${country.flag}: ${country.name} ${country.phoneCode}`,
                              }))}
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
                            <FormLabel>
                              <img
                                src={WhatsappLogo}
                                alt="WhatsApp"
                                className="min-w-8"
                              />
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div>Nationality crashed</div>}>
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-bold">
                      <span className="text-red-500">*</span>Nationality
                    </FormLabel>
                    <Combobox
                      disabled={isReadOnly}
                      options={countries.map((country) => ({
                        value: country.name,
                        label: `${country.flag} ${country.name}`,
                      }))}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select nationality"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ErrorBoundary>{" "}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ErrorBoundary fallback={<div>Email field crashed</div>}>
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
          </ErrorBoundary>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <ErrorBoundary fallback={<div>Account Info crashed</div>}>
            <section className="flex flex-col rounded-lg bg-muted p-4 gap-2">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem className="w-full bg-muted">
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
                  <FormItem className="w-full bg-muted">
                    <FormLabel
                      className={AccountType === "Secondary" ? "font-bold" : ""}
                    >
                      {AccountType === "Secondary" && (
                        <span className="text-red-500">*</span>
                      )}
                      Account Relation
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isReadOnly || AccountType === "Primary"}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue
                            placeholder={
                              AccountType === "Primary"
                                ? "Account is primary"
                                : "Select account type"
                            }
                          />
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
            </section>

            <section className="overflow-hidden rounded-lg">
              <FormField
                control={form.control}
                name="customerSegment"
                render={({ field }) => (
                  <FormItem className="w-full bg-muted p-4">
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
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="bg-muted p-4">
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
            </section>
          </ErrorBoundary>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-muted p-4 rounded-lg space-y-4"
        >
          <ErrorBoundary fallback={<div>Address fields crashed</div>}>
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
          </ErrorBoundary>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex gap-6 justify-center"
        >
          <ErrorBoundary fallback={<div>Action buttons crashed</div>}>
            {/* Customer loaded, not editing */}
            {!isEditing && customerRecordId && (
              <>
                <Button type="button" variant="outline" onClick={handleEdit}>
                  Edit Customer
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

            {/* Editing an existing customer */}
            {isEditing && customerRecordId && (
              <>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Customer"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </Button>
              </>
            )}

            {/* Creating a new customer */}
            {isEditing && !customerRecordId && (
              <>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Customer"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancelCreation}
                >
                  Cancel Creation
                </Button>
              </>
            )}
          </ErrorBoundary>
        </motion.div>
      </motion.form>
    </Form>
  );
}
