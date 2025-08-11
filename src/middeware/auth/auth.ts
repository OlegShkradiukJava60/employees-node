import {Request, Response, NextFunction} from "express"
import JwtUtil from "../../security/JwtUtil.ts";
const BEARER = "Bearer ";
export function authenticate(req: Request & {username: string, role: string} , res: Response, next: NextFunction): void {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith(BEARER)) {
        const token = authHeader.substring(BEARER.length);
        const payload = JwtUtil.verifyToken(token);
        req.username = payload.sub;
        req.role = payload.role;
        

    }
    next();
}
//TODO middleware of making decision about following processing