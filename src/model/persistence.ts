import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export function restoreFromFile(service: any, filePath: string) {
    try {
        if (!existsSync(filePath)) {
            mkdirSync(dirname(filePath), { recursive: true });
            writeFileSync(filePath, JSON.stringify({ employees: [] }, null, 2), "utf8");
            return;
        }
        const txt = readFileSync(filePath, "utf8");
        if (!txt.trim()) return;

        const data = JSON.parse(txt);
        const arr = Array.isArray(data.employees) ? data.employees : [];
        arr.forEach((empl: any) => service.addEmployee(empl));
    } catch (e) {
        console.error("restoreFromFile error:", e);
    }
}

export function saveToFile(service: any, filePath: string) {
    try {
        const all = service.getAll(); 
        writeFileSync(filePath, JSON.stringify({ employees: all }, null, 2), "utf8");
    } catch (e) {
        console.error("saveToFile error:", e);
    }
}
