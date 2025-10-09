import type { Customer } from "@/types/customer";
import type { CustomerDemographicsSchema } from "@/components/forms/customer-demographics/schema";
import { customerDemographicsSchema } from "@/components/forms/customer-demographics/schema";

export const mapCustomerToFormValues = (customer: Customer): Partial<CustomerDemographicsSchema> => {
  const fields = customer.fields;

  // Helper to safely get enum values
  const getValidEnumValue = <T extends string>(value: string | number | undefined, allowedValues: readonly T[]): T | "" => {
    const stringValue = String(value || "");
    if (allowedValues.includes(stringValue as T)) {
      return stringValue as T;
    }
    return "";
  };

  const countryCodeOptions = customerDemographicsSchema.shape.countryCode.options;
  const alternativeCountryCodeOptions = customerDemographicsSchema.shape.alternativeCountryCode.unwrap().options;
  const nationalityOptions = customerDemographicsSchema.shape.nationality.options;

  return {
    customerType: "Existing", // Explicitly set to Existing when mapping a found customer
    id: customer.id, // Top-level ID is string
    name: fields.Name || "",
    nickName: fields.NickName || "",
    countryCode: getValidEnumValue(fields.CountryCode, countryCodeOptions),
    mobileNumber: fields.Phone || "", // Ensure phone is always a string
    alternativeCountryCode: getValidEnumValue(fields.AlternateCountryCode, alternativeCountryCodeOptions),
    alternativeMobileNumber: fields.AlternateMobile || "",
    whatsapp: fields.Whatsapp || false, // Default to false
    instagram: fields.InstaID ? String(fields.InstaID) : "",
    email: fields.Email || "",
    nationality: getValidEnumValue(fields.Nationality, nationalityOptions),
    address: {
      city: fields.City || "",
      area: fields.Area || "",
      block: fields.Block || "",
      street: fields.Street || "",
      houseNumber: fields.HouseNo || "",
      addressNote: fields.AddressNote || "",
    },
    dob: fields.DOB ? new Date(fields.DOB) : undefined,
    accountType: fields.AccountType || "",
    customerSegment: fields.CustomerSegment || "",
    note: fields.Note || "",
    whatsappOnAlt: fields.WhatsappAlt || false,
  };
};

export const mapFormValuesToCustomer = (values: CustomerDemographicsSchema, customerRecordId?: string | null): { id?: string; fields: Partial<Customer["fields"]> } => {
  return {
    id: customerRecordId || undefined,
    fields: {
      Phone: values.mobileNumber,
      Name: values.name,
      NickName: values.nickName || undefined,
      CountryCode: values.countryCode,
      AlternateCountryCode: values.alternativeCountryCode,
      AlternateMobile: values.alternativeMobileNumber,
      Whatsapp: values.whatsapp || false,
      Email: values.email || undefined,
      Nationality: values.nationality,
      InstaID: values.instagram ? Number(values.instagram) : undefined,
      City: values.address.city || undefined,
      Area: values.address.area || undefined,
      Block: values.address.block || undefined,
      Street: values.address.street || undefined,
      HouseNo: values.address.houseNumber,
      AddressNote: values.address.addressNote || undefined,
      DOB: values.dob ? values.dob.toISOString().split("T")[0] : undefined,
      AccountType: values.accountType || undefined,
      CustomerSegment: values.customerSegment || undefined,
      Note: values.note || undefined,
      WhatsappAlt: values.whatsappOnAlt || false,
    },
  };
};

