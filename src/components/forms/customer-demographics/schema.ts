import { z } from "zod";

export const customerDemographicsDefaults: CustomerDemographicsSchema = {
  id: undefined,
  customerType: "New",
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
  accountType: "",
  customerSegment: "",
  note: "",
  whatsappOnAlt: false,
};

export const customerDemographicsSchema = z.object({
  id: z.string().optional(),
  customerType: z.enum(["New", "Existing"]),
  name: z.string("Invalid Name").min(1, "Name is required"),
  nickName: z.string().optional(),
  countryCode: z.enum(["", "+91", "+1", "+44", "+965"]),
  mobileNumber: z.string("Invalid Mobile Number").min(1, "Mobile number is required"),
  alternativeCountryCode: z.enum(["", "+91", "+1", "+44", "+965"]).optional(),
  alternativeMobileNumber: z.string().optional(),
  whatsapp: z.boolean(),
  email: z.string().optional(),
  nationality: z.enum(["", "Kuwaiti", "Saudi", "Bahraini", "Qatari", "Emirati"]),
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
});

export type CustomerDemographicsSchema = z.infer<typeof customerDemographicsSchema>;

