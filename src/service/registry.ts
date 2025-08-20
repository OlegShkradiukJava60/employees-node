import EmployeesService from "./EmployeesService";

type Factory = (deps: any) => Promise<EmployeesService>;
const registry = new Map<string, Factory>();
export function registerEmployeesService(key: string, factory: Factory): void {
    if(registry.has(key)) {
        throw new Error(`${key} already registered`)
    }
    registry.set(key, factory);
}
export function createEmployeesService(key: string, deps: any = {}): Promise<EmployeesService> {
    if(!registry.has(key)) {
        throw new Error(`key ${key} is unknown, known are ${listEmployeesServices().join('; ')}`)
    }
   return registry.get(key)(deps)
}
export function listEmployeesServices(): string[] {
    return Array.from(registry.keys());
}