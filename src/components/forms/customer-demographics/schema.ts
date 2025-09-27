import { z } from "zod";

export const customerDemographicsSchema = z.object({
  customerType: z.enum(["New", "Existing"]),
  searchMobileNumber: z.string().optional(),
  searchOrderNumber: z.string().optional(),
  searchCustomerId: z.string().optional(),
  name: z.string("Invalid Name").min(1, "Name is required"),
  nickName: z.string().optional(),
  countryCode: z.enum(["+91", "+1", "+44", "+965"]),
  mobileNumber: z.string("Invalid Mobile Number").min(1, "Mobile number is required"),
  alternativeCountryCode: z.enum(["+91", "+1", "+44", "+965"]).optional(),
  alternativeMobileNumber: z.string().optional(),
  whatsApp: z.boolean().optional(),
  influencer: z.boolean().optional(),
  instaId: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  customerTypeRegularVip: z.enum(["Regular", "VIP"]),
  customerNationality: z.enum(["Kuwaiti", "Saudi", "Bahraini", "Qatari", "Emirati"]),
  address: z.object({
    governorate: z.string().optional(),
    block: z.string().optional(),
    street: z.string().optional(),
    houseBuildingNo: z.string().optional(),
    floor: z.string().optional(),
    aptNo: z.string().optional(),
    landmark: z.string().optional(),
    dob: z.date().optional(),
  }),
});

export type CustomerDemographicsSchema = z.infer<typeof customerDemographicsSchema>;
