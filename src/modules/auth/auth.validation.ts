import { z } from "zod";

const authValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const driverRegistration = z.object({
  body: z.object({
    // User fields
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(1, "Phone number is required"),

    // Driver specific fields
    yearsOfExperience: z.string().or(z.number()).transform((val) => Number(val)), 
    licenseExpiryDate: z.string().min(1, "License expiry date is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
});

export const authValidationSchema = {
  authValidation,
  driverRegistration
};
