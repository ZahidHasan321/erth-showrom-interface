import { z } from "zod";

export const customerDemographicsSchema = z
  .object({
    id: z.number().optional(),
    customerRecordId: z.string().optional(),
    name: z.string("Invalid Name").min(1, "Name is required"),
    nickName: z.string(),
    countryCode: z.string().min(1, "Country code is required"),
    mobileNumber: z
      .string("Invalid Mobile Number")
      .min(1, "Mobile number is required"),
    alternativeCountryCode: z.string().optional(),
    alternativeMobileNumber: z.string().optional(),
    whatsapp: z.boolean(),
    email: z.string().optional(),
    nationality: z.string().optional(),
    instagram: z.string().optional(),
    address: z.object({
      city: z.string().optional(),
      area: z.string().optional(),
      block: z.string().optional(),
      street: z.string().optional(),
      houseNumber: z.string().optional(),
      addressNote: z.string().optional(),
    }),
    dob: z.date().optional(),
    accountType: z.string().optional(),
    customerSegment: z.string().optional(),
    note: z.string().optional(),
    whatsappOnAlt: z.boolean().optional(),
    relation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.alternativeMobileNumber && !data.alternativeCountryCode) {
      ctx.addIssue({
        code: "custom",
        path: ["alternativeCountryCode"],
        message:
          "Country code is required when alternative mobile number is provided.",
      });
    }
    if (data.alternativeCountryCode && !data.alternativeMobileNumber) {
      ctx.addIssue({
        code: "custom",
        path: ["alternativeMobileNumber"],
        message:
          "Alternative mobile number is required when country code is provided.",
      });
    }
    if (data.accountType === "Secondary" && !data.relation) {
      ctx.addIssue({
        code: "custom",
        path: ["relation"],
        message: "Account relation is required for secondary accounts.",
      });
    }
  });

export type CustomerDemographicsSchema = z.infer<
  typeof customerDemographicsSchema
>;

export const customerDemographicsDefaults: CustomerDemographicsSchema = {
  id: undefined,
  customerRecordId: undefined,
  name: "",
  nickName: "",
  countryCode: "",
  mobileNumber: "",
  alternativeCountryCode: "",
  alternativeMobileNumber: "",
  whatsapp: false,
  email: "",
  nationality: "",
  instagram: "",
  address: {
    city: "",
    area: "",
    block: "",
    street: "",
    houseNumber: "",
    addressNote: "",
  },
  dob: undefined,
  accountType: undefined,
  customerSegment: "",
  note: "",
  whatsappOnAlt: false,
  relation: undefined,
};
