import { z } from "zod";

export const customerDemographicsDefaults: CustomerDemographicsSchema = {
  id: undefined,
  name: "",
  nickName: "",
  countryCode: "",
  mobileNumber: "",
  alternativeCountryCode: "",
  alternativeMobileNumber: "",
  whatsapp: false,
  email: "",
  nationality: "Kuwait",
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
  accountType: "",
  customerSegment: "",
  note: "",
  whatsappOnAlt: false,
  relation: undefined
};

export const customerDemographicsSchema = z.object({
  id: z.string().optional(),
  name: z.string("Invalid Name").min(1, "Name is required"),
  nickName: z.string().optional(),
  countryCode: z.string(),
  mobileNumber: z.string("Invalid Mobile Number").min(1, "Mobile number is required"),
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
  relation: z.string().optional()
});

export type CustomerDemographicsSchema = z.infer<typeof customerDemographicsSchema>;

