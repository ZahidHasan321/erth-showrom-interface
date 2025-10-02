import { z } from "zod";


export const customerDemographicsDefaults: CustomerDemographicsSchema = {
  customerType: "New", // defaulting to New
  name: "",
  nickName: "",
  countryCode: "", // pick one as default
  mobileNumber: "",
  alternativeCountryCode: "",
  alternativeMobileNumber: "",
  hasWhatsApp: false,
  isInfluencer: false,
  instagramId: "",
  email: "",
  customerCategory: "Regular", 
  nationality: "",
  address: {
    governorate: "",
    block: "",
    street: "",
    houseNumber: "",
    floor: "",
    aptNo: "",
    landmark: "",
    dob: undefined,
  },
};

export const customerDemographicsSchema = z.object({
  customerType: z.enum(["New", "Existing"]),
  name: z.string("Invalid Name").min(1, "Name is required"),
  nickName: z.string().optional(),
  countryCode: z.enum(["","+91", "+1", "+44", "+965"]),
  mobileNumber: z.string("Invalid Mobile Number").min(1, "Mobile number is required"),
  alternativeCountryCode: z.enum(["","+91", "+1", "+44", "+965"]).optional(),
  alternativeMobileNumber: z.string().optional(),
  hasWhatsApp: z.boolean().optional(),
  isInfluencer: z.boolean().optional(),
  instagramId: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  customerCategory: z.enum(["Regular", "VIP"]),
  nationality: z.enum(["","Kuwaiti", "Saudi", "Bahraini", "Qatari", "Emirati"]),
  address: z.object({
    governorate: z.string().optional(),
    block: z.string().optional(),
    street: z.string().optional(),
    houseNumber: z.string().optional(),
    floor: z.string().optional(),
    aptNo: z.string().optional(),
    landmark: z.string().optional(),
    dob: z.date().optional(),
  }),
});

export type CustomerDemographicsSchema = z.infer<typeof customerDemographicsSchema>;
