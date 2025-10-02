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
  const customerCategoryOptions = customerDemographicsSchema.shape.customerCategory.options;
  const nationalityOptions = customerDemographicsSchema.shape.nationality.options;

  return {
    name: fields.Name,
    nickName: fields.NickName || "",
    countryCode: getValidEnumValue(fields.CountryCode, countryCodeOptions),
    mobileNumber: String(fields.Phone),
    alternativeCountryCode: getValidEnumValue(fields.AlternateCountryCode, alternativeCountryCodeOptions),
    alternativeMobileNumber: fields.AlternateMobile ? String(fields.AlternateMobile) : "",
    hasWhatsApp: fields.whatsapp || false,
    isInfluencer: false, // Not in Customer interface, default to false
    instagramId: fields.InstaID || "",
    email: fields.Email || "",
    customerCategory: getValidEnumValue(fields.CustomerType, customerCategoryOptions),
    nationality: getValidEnumValue(fields.Nationality, nationalityOptions),
    address: {
      governorate: fields.Governorate || "",
      block: fields.Block || "",
      street: fields.Street || "",
      houseNumber: fields.HouseNo ? String(fields.HouseNo) : "",
      floor: fields.Floor || "",
      aptNo: fields.AptNo || "",
      landmark: fields.Landmark || "",
      dob: fields.DOB ? new Date(fields.DOB) : undefined,
    },
  };
};
