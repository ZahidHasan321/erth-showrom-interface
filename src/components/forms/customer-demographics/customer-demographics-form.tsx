import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState, useEffect } from "react";

import { searchCustomerByPhone } from "@/api/customers";
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
import { customerDemographicsSchema } from "./schema";
import {useCurrentWorkOrderStore} from "@/store/current-work-order";
import type { UseFormReturn } from "react-hook-form";
import { SearchIcon } from "lucide-react";

interface CustomerDemographicsFormProps {
  form: UseFormReturn<z.infer<typeof customerDemographicsSchema>>;
}

export function CustomerDemographicsForm({ form }: CustomerDemographicsFormProps) {
  const { setCustomerDemographics, markStepSaved } = useCurrentWorkOrderStore();

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [searchPhone, setSearchPhone] = useState<string | null>(null);

  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: ["customer", searchPhone],
    queryFn: () => searchCustomerByPhone(searchPhone!),
    enabled: !!searchPhone,
  });

  useEffect(() => {
    if (isSuccess && data) {
      form.setValue("name", data.record.fields.NAME);
      setIsReadOnly(true);
    }
  }, [isSuccess, data, form]);

  useEffect(() => {
    if (isError && error) {
      console.error("Error searching for customer:", error);
    }
  }, [isError, error]);

  const customerType = form.watch("customerType");

  async function handleSearch() {
    const phone = form.getValues("searchMobileNumber");
    if (!phone) {
      console.log("Please enter a phone number to search.");
      return;
    }
    setSearchPhone(phone);
  }

  function onSubmit(values: z.infer<typeof customerDemographicsSchema>) {
    setCustomerDemographics(values);
    markStepSaved(0);
    form.reset(values);
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-bold mb-4">Customer Demographics</h1>

        {/* Customer Type with Search Button */}
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
                        setIsReadOnly(false);
                        form.reset();
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

        {/* Search Customer Inputs */}
        {customerType === "Existing" && (
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <h2 className={"text-xl font-semibold"}>Search Customer</h2>
            <div className={"grid grid-cols-1 md:grid-cols-3 gap-4"}>
              <FormField
                control={form.control}
                name="searchMobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Mobile Number"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="searchOrderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Order Number"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" className="w-fit" onClick={handleSearch} disabled={isFetching}>
                <SearchIcon className="w-4 h-4 mr-2" />
                {isFetching ? "Searching..." : "Search Customer Info."}
              </Button>
            </div>
          </div>
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
                name="whatsApp"
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
                  name="influencer"
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
                  name="instaId"
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
                  <FormLabel className="font-bold">*Mobile No</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                            defaultValue={field.value}
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
            name="customerTypeRegularVip"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel>Customer Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
            name="customerNationality"
            render={({ field }) => (
              <FormItem className="w-full bg-muted p-4 rounded-lg">
                <FormLabel>Customer Nationality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                name="address.houseBuildingNo"
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
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="button" variant="outline">
            Edit
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
