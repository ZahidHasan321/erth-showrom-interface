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
  const customerCategoryOptions = customerDemographicsSchema.shape.customerCategory.unwrap().options;
  const nationalityOptions = customerDemographicsSchema.shape.nationality.options;

  return {
    customerType: "Existing", // Explicitly set to Existing when mapping a found customer
    id: customer.id, // Top-level ID is string
    name: fields.Name,
    nickName: fields.NickName || "",
    countryCode: getValidEnumValue(fields.CountryCode, countryCodeOptions),
    mobileNumber: fields.Phone, // No String() conversion
    alternativeCountryCode: getValidEnumValue(fields.AlternateCountryCode, alternativeCountryCodeOptions), // Use getValidEnumValue
    alternativeMobileNumber: fields.AlternateMobile ? String(fields.AlternateMobile) : "", // Convert to string
    hasWhatsApp: fields.Whatsapp || false,
    isInfluencer: fields.InstaID ? true : false,
    instagramId: fields.InstaID ? String(fields.InstaID) : "", // Convert InstaID to string
    email: fields.Email || "",
    customerCategory: getValidEnumValue(
      (() => {
        const customerTypeName = Array.isArray(fields.CustomerType) && fields.CustomerType.length > 0
          ? fields.CustomerType[0].name
          : fields.CustomerType;
        return customerTypeName === "VIP" ? "VIP" : "Regular";
      })(),
      customerCategoryOptions
    ), // Re-add customerCategory mapping
    nationality: getValidEnumValue(fields.Nationality, nationalityOptions),
    address: {
      governorate: fields.Governorate || "",
      block: fields.Block || "",
      street: fields.Street || "",
      houseNumber: fields.HouseNo || "",
      floor: fields.Floor || "",
      aptNo: fields.AptNo || "",
      landmark: fields.Landmark || "",
      dob: fields.DOB ? new Date(fields.DOB) : undefined,
    },
  };
};
