import { ZodError } from "zod";
export function getZodMessage(error: ZodError): string {
    return error.issues.reduce((res:string, iss) => res + `${res ? "; ":""}${String(iss.path[0])}: ${iss.message}`, "");
}