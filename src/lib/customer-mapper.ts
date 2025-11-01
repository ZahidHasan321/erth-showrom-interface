import type { Customer } from "@/types/customer";
import type { CustomerDemographicsSchema } from "@/components/forms/customer-demographics/schema";

export const mapCustomerToFormValues = (
  customer: Customer,
): Partial<CustomerDemographicsSchema> => {
  const fields = customer.fields;

  return {
    id: customer.fields.id, // Top-level ID is string
    customerRecordId: customer.id,
    name: fields.Name || "",
    nickName: fields.NickName || "",
    arabicName: fields.ArabicName || "",
    arabicNickname: fields.ArabicNickname || "",
    countryCode: fields.CountryCode || "",
    mobileNumber: fields.Phone || "", // Ensure phone is always a string
    alternativeCountryCode: fields.AlternateCountryCode || "",
    alternativeMobileNumber: fields.AlternateMobile || "",
    whatsapp: fields.Whatsapp || false, // Default to false
    instagram: fields.InstaID ? String(fields.InstaID) : "",
    email: fields.Email || "",
    nationality: fields.Nationality || "",
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
    relation: fields.Relation || undefined,
  };
};

export const mapFormValuesToCustomer = (
  values: CustomerDemographicsSchema,
  customerRecordId?: string | null,
): { id?: string; fields: Partial<Customer["fields"]> } => {
  return {
    id: customerRecordId || undefined,
    fields: {
      Phone: values.mobileNumber,
      Name: values.name,
      NickName: values.nickName || undefined,
      ArabicName: values.arabicName || undefined,
      ArabicNickname: values.arabicNickname || undefined,
      CountryCode: values.countryCode,
      AlternateCountryCode: values.alternativeCountryCode,
      AlternateMobile: values.alternativeMobileNumber,
      Whatsapp: values.whatsapp || false,
      Email: values.email || undefined,
      Nationality: values.nationality,
      InstaID: values.instagram ? values.instagram : undefined,
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
      Relation: values.relation || undefined,
    },
  };
};
