import { z } from "zod";

export const employeeZod = z.object({
    id: z.string().optional(),
    fullName: z.string().min(1, "fullName is required"),
    department: z.string().min(1, "department is required"),
    salary: z.number().int().nonnegative("salary must be >= 0"),
    birthDate: z.string().refine(v => !Number.isNaN(Date.parse(v)), {
        message: "birthDate must be YYYY-MM-DD"
    }),
    avatar: z.string().url().optional()
});
