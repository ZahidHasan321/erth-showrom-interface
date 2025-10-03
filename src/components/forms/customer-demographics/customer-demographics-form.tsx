import { upsertCustomer } from "@/api/customers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { mapCustomerToFormValues } from "@/lib/customer-mapper";
import type { Customer } from "@/types/customer";
import * as React from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { customerDemographicsDefaults, customerDemographicsSchema } from "./schema";
import { SearchCustomer } from "./search-customer";

interface CustomerDemographicsFormProps {
  form: UseFormReturn<z.infer<typeof customerDemographicsSchema>>;
  onSubmit: (values: z.infer<typeof customerDemographicsSchema>) => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onCustomerChange?: (customerId: string | null) => void;
}

export function CustomerDemographicsForm({ form, onSubmit, onEdit, onCancel, onCustomerChange }: CustomerDemographicsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayCustomerId, setDisplayCustomerId] = useState<number | null>(null);
  const [customerRecordId, setCustomerRecordId] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const customerType = form.watch("customerType");

  React.useEffect(() => {
    onCustomerChange?.(customerRecordId);
  }, [customerRecordId, onCustomerChange]);

  React.useEffect(() => {
    if (customerType === "New") {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [customerType]);

  const handleCustomerFound = React.useCallback(
    (customer: Customer) => {
      const formValues = mapCustomerToFormValues(customer);
      form.reset(formValues);
      setDisplayCustomerId(customer.fields.id ?? null);
      setCustomerRecordId(customer.id);
      setIsEditing(false); // Ensure editing is off when a new customer is found
      onSubmit(form.getValues());
    },
    [form, onSubmit]
  );

  const handleClearSearch = React.useCallback(() => {
    form.reset({ ...customerDemographicsDefaults, customerType: "Existing" });
    setDisplayCustomerId(null);
    setIsEditing(false);
    onCancel?.();
  }, [form, onCancel]);

  const handleFormSubmit = async (values: z.infer<typeof customerDemographicsSchema>) => {
    const customerToUpsert: { id?: string; fields: Partial<Customer["fields"]> } = {
      id: customerRecordId || undefined,
      fields: {
        Phone: values.mobileNumber,
        Name: values.name,
        NickName: values.nickName || undefined,
        CountryCode: values.countryCode,
        AlternateCountryCode: values.alternativeCountryCode,
        AlternateMobile: values.alternativeMobileNumber,
        Whatsapp: values.hasWhatsApp || false,
        Email: values.email || undefined,
        Nationality: values.nationality,
        InstaID: values.instagramId ? Number(values.instagramId) : undefined,
        Governorate: values.address.governorate || undefined,
        Floor: values.address.floor || undefined,
        Block: values.address.block || undefined,
        AptNo: values.address.aptNo || undefined,
        Street: values.address.street || undefined,
        Landmark: values.address.landmark || undefined,
        HouseNo: values.address.houseNumber,
        DOB: values.address.dob ? values.address.dob.toISOString().split("T")[0] : undefined,
      },
    };

    try {
      const response = await upsertCustomer([customerToUpsert], ["Phone"]);
      if (response.status === "success" && response.data) {
        const wasNewCustomer = !customerRecordId;
        toast.success(`Customer ${wasNewCustomer ? "created" : "updated"} successfully!`);
        const upsertedCustomerData = response.data.records.at(0) as Customer;
        setDisplayCustomerId(upsertedCustomerData.fields.id ?? null);
        setCustomerRecordId(upsertedCustomerData.id);
        if (wasNewCustomer) {
          form.setValue("customerType", "Existing");
          setTimeout(() => setIsEditing(false), 0);
        } else {
          setIsEditing(false);
        }
      } else {
        toast.error(response.message || `Failed to ${customerRecordId ? "update" : "create"} customer.`);
      }
    } catch (error) {
      toast.error(`Failed to ${customerRecordId ? "update" : "create"} customer.`);
      console.error("Error upserting customer:", error);
    }
    onSubmit(values);
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
      description: "Are you sure you want to cancel? Any unsaved changes will be lost.",
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

  const isReadOnly = !isEditing && customerType === "Existing";

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8 max-w-7xl">
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-4">Customer Demographics</h1>
          {displayCustomerId && (
            <div className="text-lg font-semibold p-2 bg-muted rounded-md">
              Customer ID: <span className="font-mono text-primary">{displayCustomerId}</span>
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="p-4 rounded-lg">
            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Customer Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "New") {
                        setDisplayCustomerId(null);
                        setCustomerRecordId(null);
                        form.reset(customerDemographicsDefaults);
                        setIsEditing(true);
                      } else if (value === "Existing") {
                        setIsEditing(false);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="New / Existing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Existing">Existing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {customerType === "Existing" && (
          <SearchCustomer
            onCustomerFound={handleCustomerFound}
            onClearSearch={handleClearSearch}
            customerType={customerType}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="bg-muted p-4 rounded-lg">
              <FormLabel className="font-bold"><span className="text-red-500">*</span>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Customer Full Name"
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
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem className={"bg-muted p-4 rounded-lg"}>
                  <FormLabel>Nick Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nick Name" {...field} className="bg-white" readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hasWhatsApp"
                render={({ field }) => (
                  <FormItem className="bg-muted p-4 rounded-lg">
                    <FormLabel className="font-bold"><span className="text-red-500">*</span>WhatsApp</FormLabel>
                    <div className="flex items-center gap-2">
                      <img
                        alt="WhatsApp"
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        className="w-8 h-8"
                      />
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="bg-white"
                          disabled={isReadOnly}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 bg-muted p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name="isInfluencer"
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
                      <FormLabel>Influencer</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Insta ID"
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
          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold"><span className="text-red-500">*</span>Mobile No</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isReadOnly}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Country Code" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+965">+965</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormControl>
                      <Input
                        placeholder="Mobile Number"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternativeMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Mobile No</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="alternativeCountryCode"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isReadOnly}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Country Code" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+965">+965</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormControl>
                      <Input
                        placeholder="Mobile Number"
                        {...field}
                        className="bg-white"
                        readOnly={isReadOnly}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Email Section */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="bg-muted p-4 rounded-lg">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  placeholder="Customer Email ID"
                  {...field}
                  className="bg-white"
                  readOnly={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Customer Type & Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customerCategory"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel>Customer Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Regular / VIP" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel className="font-bold"><span className="text-red-500">*</span>Customer Nationality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Kuwaiti" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Kuwaiti">Kuwaiti</SelectItem>
                    <SelectItem value="Saudi">Saudi</SelectItem>
                    <SelectItem value="Bahraini">Bahraini</SelectItem>
                    <SelectItem value="Qatari">Qatari</SelectItem>
                    <SelectItem value="Emirati">Emirati</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Section */}
        <div className="bg-muted p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address.governorate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governorate</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
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
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
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
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
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
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address.floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.aptNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apt. No</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOB</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-6 justify-center">
          {customerType === "Existing" && !isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={handleEdit}
            >
              Edit Customer Details
            </Button>
          )}
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          {(isEditing || customerType === "New") && (
            <Button type="submit">
              Save Customer
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
