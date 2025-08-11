const MIN_SALARY_VAR_NAME="MIN_SALARY", DEFAULT_MIN_SALARY =5000;
const MAX_SALARY_VAR_NAME = "MAX_SALARY", DEFAULT_MAX_SALARY = 50000;
const MIN_AGE_VAR_NAME = "MIN_AGE", DEFAULT_MIN_AGE = 20;
const MAX_AGE_VAR_NAME = "MAX_AGE", DEFAULT_MAX_AGE = 72;
const DEFAULT_DEPARTMENTS = ["QA", "Development", "Audit", "Accounting","Management"]
export function getMinSalary(): number {
   return getNumberConfigValue(MIN_SALARY_VAR_NAME, DEFAULT_MIN_SALARY);
}
export function getMaxSalary(): number {
    return getNumberConfigValue(MAX_SALARY_VAR_NAME, DEFAULT_MAX_SALARY);
}
export function getMinAge(): number {
    return getNumberConfigValue(MIN_AGE_VAR_NAME, DEFAULT_MIN_AGE);
}
export function getMaxAge(): number {
    return getNumberConfigValue(MAX_AGE_VAR_NAME, DEFAULT_MAX_AGE);
}
export function getDepartments(): string[] {
    return process.env.DEPARTMENTS as unknown as string[] || DEFAULT_DEPARTMENTS;
}
function getNumberConfigValue(variableName: string, defaultValue: number): number {
 const configValue = process.env[variableName];
 let res: number = defaultValue;
 if (Number.isInteger(configValue)) {
    res = +configValue;
 }
 return res
}
export function getDate(age: number): string {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - age);
    return currentDate.toISOString().substring(0, 10);
}
export function getMaxDate() {
    return getDate(getMinAge());
}
export function getMinDate() {
    return getDate(getMaxAge());
}