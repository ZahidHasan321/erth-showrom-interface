import { z } from "zod";

export const customerDemographicsSchema = z.object({
  customerType: z.string(),
  searchMobileNumber: z.string().optional(),
  searchOrderNumber: z.string().optional(),
  searchCustomerId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  nickName: z.string().optional(),
  countryCode: z.string(),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  alternativeCountryCode: z.string().optional(),
  alternativeMobileNumber: z.string().optional(),
  whatsApp: z.boolean().optional(),
  influencer: z.boolean().optional(),
  instaId: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  customerTypeRegularVip: z.string(),
  customerNationality: z.string(),
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
