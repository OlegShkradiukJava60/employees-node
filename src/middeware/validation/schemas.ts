import z from "zod";
import {
  getDepartments,
  getMaxDate,
  getMaxSalary,
  getMinDate,
  getMinSalary,
} from "../../utils/config_functions.ts";
const departments: Set<string> = new Set(getDepartments());
console.log(Array.from(departments.values()))
export const EmployeeSchema = z.object({
  fullName: z.string().min(5),
  id: z.string().optional(),
  avatar: z.union([z.url(), z.literal("")]).optional(),
  department: z.string().refine(
    val =>departments.has(val),
    { message: `must be one out of ${Array.from(departments.values())}` }
  ),
  birthDate: z.iso.date().refine(
    val => val >= getMinDate() &&
        val <= getMaxDate() ,
    { message: `must be ISO date from ${getMinDate()} to ${getMaxDate()}]` }
  ),
  salary: z.number().int().min(getMinSalary()).max(getMaxSalary()),
});
export const EmployeeSchemaPartial = EmployeeSchema.partial();
