import {Request, Response, NextFunction, RequestHandler} from "express"
import JwtUtil from "../../security/JwtUtil.ts";
import { AuthenticationError, AuthorizationError } from "../../model/error-types/aaa-errors.ts";
const BEARER = "Bearer ";
export function authenticate(req: Request & {username: string, role: string} , res: Response, next: NextFunction): void {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith(BEARER)) {
        const token = authHeader.substring(BEARER.length);
        try {
            const payload = JwtUtil.verifyToken(token);
            req.username = payload.sub;
            req.role = payload.role;
        } catch (error) {
            throw new AuthenticationError()
        }
        

    }
    next();
}

export function auth(roles: string[]): RequestHandler {
    return (req: Request & {username: string, role: string}, _, next) => {
            if(!req.role) {
                throw new AuthenticationError();
            }
            if(!roles.includes(req.role)) {
                throw new AuthorizationError();
            }
            next();

    }
}