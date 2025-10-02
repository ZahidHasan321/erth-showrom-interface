import { upsertCustomer } from "@/api/customers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
}

export function CustomerDemographicsForm({ form, onSubmit }: CustomerDemographicsFormProps) {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [displayCustomerId, setDisplayCustomerId] = useState<number | null>(null);
  const [customerRecordId, setCustomerRecordId] = useState<string|null>(null);

  const customerType = form.watch("customerType");


  const handleCustomerFound = React.useCallback((customer: Customer) => {
    const formValues = mapCustomerToFormValues(customer);
    form.reset(formValues);
    setDisplayCustomerId(customer.fields.id??null);
    setCustomerRecordId(customer.id)
  }, [form, setDisplayCustomerId]);

  const handleClearSearch = React.useCallback(() => {
    form.reset({ ...customerDemographicsDefaults, customerType: "Existing" }); // Reset to empty but keep customerType as Existing
    setDisplayCustomerId(null);
    setIsReadOnly(true); // Keep read-only
  }, [form, setDisplayCustomerId, setIsReadOnly]);

  const handleFormSubmit = async (values: z.infer<typeof customerDemographicsSchema>) => {
    const customerToUpsert: { id?: string; fields: Partial<Customer['fields']> } = {
      id: customerRecordId || undefined,
      fields: {
        Phone: values.mobileNumber,
        Name: values.name,
        NickName: values.nickName || undefined,
        CountryCode: values.countryCode,
        AlternateCountryCode: values.alternativeCountryCode,
        AlternateMobile: values.alternativeMobileNumber !== "" ? Number(values.alternativeMobileNumber) : undefined,
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
        DOB: values.address.dob ? values.address.dob.toISOString().split('T')[0] : undefined
      }
    };

    try {
      const response = await upsertCustomer([customerToUpsert], [ "Phone"]);
      if (response.status === "success" && response.data) {
        const wasNewCustomer = displayCustomerId === undefined || displayCustomerId === null; // Check before updating displayCustomerId
        toast.success(`Customer ${wasNewCustomer ? "created" : "updated"} successfully!`);
        const upsertedCustomerData = response.data.records.at(0) as Customer;
        setDisplayCustomerId(upsertedCustomerData.fields.id??null); // Update displayCustomerId with the new ID

        setIsReadOnly(true); // Set form to read-only

        if (wasNewCustomer) {
          form.setValue('customerType', 'Existing'); // Change customerType to Existing
        }
        console.log("customer demo form -> ", response)
      } else {
        toast.error(response.message || `Failed to ${displayCustomerId ? "update" : "create"} customer.`);
      }
    } catch (error) {
      toast.error(`Failed to ${displayCustomerId ? "update" : "create"} customer.`);
      console.error("Error upserting customer:", error);
    }
    onSubmit(values);
  };


  return (
    <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "New") {
                        setDisplayCustomerId(null);
                        form.reset(customerDemographicsDefaults)
                        setIsReadOnly(false);
                      } else if (value === "Existing") {
                        setIsReadOnly(true);
                      }
                    }}
                    defaultValue={field.value}
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
              <FormLabel className="font-bold">*Name</FormLabel>
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
                    <FormLabel>WhatsApp</FormLabel>
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
              </div>            </div>
          </div>
          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">*Mobile No</FormLabel>
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
                                <SelectValue placeholder="Country Code">{field.value}</SelectValue>
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
                                <SelectValue placeholder="Country Code">{field.value}</SelectValue>
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
                      <SelectValue placeholder="Regular / VIP">{field.value}</SelectValue>
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
                <FormLabel>Customer Nationality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Kuwaiti">{field.value}</SelectValue>
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
          { displayCustomerId !== null && customerType === "Existing" && <Button type="button" variant="outline" onClick={() => setIsReadOnly(false)}>
            Edit
          </Button> }
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
