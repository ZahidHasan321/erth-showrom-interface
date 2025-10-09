
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mapCustomerToFormValues, mapFormValuesToCustomer } from "@/lib/customer-mapper";
import type { Customer } from "@/types/customer";
import * as React from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { customerDemographicsDefaults, customerDemographicsSchema } from "./schema";
import { SearchCustomer } from "./search-customer";
import { upsertCustomer } from "@/api/customers";

interface CustomerDemographicsFormProps {
  form: UseFormReturn<z.infer<typeof customerDemographicsSchema>>;
  onSubmit: (values: z.infer<typeof customerDemographicsSchema>) => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onCustomerChange?: (customerId: string | null) => void;
  onProceed?: () => void;
}

export function CustomerDemographicsForm({ form, onSubmit, onEdit, onCancel, onCustomerChange, onProceed }: CustomerDemographicsFormProps) {
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
    onCustomerChange?.(displayCustomerId ? String(displayCustomerId) : null);
  }, [displayCustomerId, onCustomerChange]);

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
    },
    [form]
  );



  const handleFormSubmit = async (values: z.infer<typeof customerDemographicsSchema>) => {
    const customerToUpsert = mapFormValuesToCustomer(values, customerRecordId);

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
          <h1 className="text-2xl font-bold mb-4">Demographics</h1>
         
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="p-4 rounded-lg">
            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "New" && customerRecordId) {
                        setConfirmationDialog({
                          isOpen: true,
                          title: "Confirm Change to New Customer",
                          description: "Are you sure you want to change to a new customer? All unsaved changes for the current customer will be lost.",
                          onConfirm: () => {
                            field.onChange(value);
                            setDisplayCustomerId(null);
                            setCustomerRecordId(null);
                            form.reset(customerDemographicsDefaults);
                            setIsEditing(true);
                            setConfirmationDialog({ ...confirmationDialog, isOpen: false });
                          },
                        });
                      } else {
                        field.onChange(value);
                        if (value === "New") {
                          setDisplayCustomerId(null);
                          setCustomerRecordId(null);
                          form.reset(customerDemographicsDefaults);
                          setIsEditing(true);
                        } else if (value === "Existing") {
                          setIsEditing(false);
                        }
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

        {customerType === "Existing" && (
          <SearchCustomer
            onCustomerFound={handleCustomerFound}
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
                  placeholder="e.g., Nasser Al-Sabah"
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
                    <Input placeholder="e.g., Abu Nasser" {...field} className="bg-white" readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem className={"bg-muted p-4 rounded-lg"}>
                  <FormLabel>Instagram ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., @erth" {...field} className="bg-white" readOnly={isReadOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className={"bg-muted p-4 rounded-lg"}>
                  <FormLabel>DOB</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} disabled={isReadOnly} />
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
                  <FormLabel className="font-bold"><span className="text-red-500">*</span>Mobile No</FormLabel>
                  <div className="flex flex-col lg:flex-row gap-2">
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternativeMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Mobile No</FormLabel>
                  <div className="flex flex-col lg:flex-row gap-2">
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold"><span className="text-red-500">*</span>Nationality</FormLabel>
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
                  placeholder="e.g., nasser@erth.com"
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
            name="accountType"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel>User Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select User Type" />
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
            name="customerSegment"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel>Segment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Segment" />
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

        {/* Address Section */}
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
                      <Input {...field} className="bg-white" readOnly={isReadOnly} />
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
                name="address.addressNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-white" readOnly={isReadOnly} />
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
                <Textarea {...field} className="bg-white" readOnly={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons Section */}
        <div className="flex gap-6 justify-center">
          {customerType === "Existing" && !isEditing && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
              >
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
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
