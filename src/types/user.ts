import { z } from "zod";

export interface User {
    _id: string;
    name: string;
    email: string;
    email_verified: boolean;
    phone_number?: string;
    phone_number_verified?: boolean;
    role: Role;
}
export enum Role {
    ADMIN = "admin",
    USER = "user",
}

export const ZodUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    email_verified: z.boolean().optional(),
    phone_number: z.string().min(1, "Phone number is required").optional(),
    phone_number_verified: z.boolean().optional(),
    role: z.string().min(1, "Role is required"),
});