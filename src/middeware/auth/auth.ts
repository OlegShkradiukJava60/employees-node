import { NextFunction, Request, Response } from "express";
import JwtUtil from "../../security/JwtUtil.ts";

export type Role = "ADMIN" | "USER";


export function authenticate(allowed: Role[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const header = req.header("Authorization") || "";
            const [type, token] = header.split(" ");

            if (type !== "Bearer" || !token) {
                return next({ status: 401, message: "no token provided" });
            }

            const payload = JwtUtil.verifyToken(token) as { role?: Role; sub?: string };

            if (!payload?.role) {
                return next({ status: 401, message: "invalid token" });
            }

            if (!allowed.includes(payload.role)) {
                return next({ status: 403, message: `forbidden for role ${payload.role}` });
            }
            (req as any).user = { username: payload.sub, role: payload.role, token };
            console.log(`[AAA] ${payload.role} -> ${req.method} ${req.originalUrl}`);

            next();
        }
        catch (_e) {
            return next({ status: 401, message: "invalid token" });
        }
    };
}
