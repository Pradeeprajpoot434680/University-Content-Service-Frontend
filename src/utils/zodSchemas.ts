import { toast } from 'sonner';
import {z, ZodError} from 'zod';
const weakPasswords = [
  "123456", "password", "12345678", "qwerty", "abc123", "111111", "123123"
];
export const signupSchema = z.object({
  identifier: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
    .refine(p => /[A-Z]/.test(p), "Password must contain at least one uppercase letter")
    .refine(p => /[!@#$%^&*(),.?":{}|<>]/.test(p), "Password must contain at least one special character")
    .refine(p => !weakPasswords.includes(p), "Password is too weak"),
  confirmPassword: z.string(),
  universityId: z.string().uuid("Invalid university ID"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const otpSchema = z.object({
  identifier: z.string().email("Invalid email"),
  otp: z.string().length(6, "Invalid OTP"),
    
});

export const loginSchema = z.object({
  identifier: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars").max(50, "Password must be at most 50 chars"),
});



const currentYear = new Date().getFullYear();

export const userInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 chars").max(100, "First name must be at most 100 chars"),
  lastName: z.string().min(2, "Last name must be at least 2 chars").max(100, "Last name must be at most 100 chars"),
  universityId: z.string().uuid("Invalid university ID"),
  departmentId: z.string().uuid("Invalid department ID"),
  programId: z.string().uuid("Invalid program ID"),
  batchYear: z
    .string()
    .regex(/^\d{4}$/, "Invalid year format")
    .refine((year) => {
      const y = parseInt(year, 10);
      return y <= currentYear && y >= currentYear - 10;
    }, `Batch year must be between ${currentYear - 10} and ${currentYear}`),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(20,"Max Length should be up 20 charcaters"),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters').max(20,"Max Length should be up 20 charcaters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const emailOrPhoneSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or phone is required')
    .refine(val => /\S+@\S+\.\S+/.test(val) || /^\d{10}$/.test(val), 'Invalid email or phone number'),
});

export const handleValidationErrors = (result: any): boolean => {
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    (result.error as ZodError).issues.forEach(err => {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    });
    toast(Object.values(fieldErrors).join("\n"));
    return true; // validation failed
  }
  return false; // validation passed
};