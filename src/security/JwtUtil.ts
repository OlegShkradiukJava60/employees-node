import jwt, { JwtPayload } from "jsonwebtoken";
import Account from "../model/Account";

const SECRET = "dev-secret";

export default class JwtUtil {
    static getJWT(account: Account): string {
        return jwt.sign({ role: account.role }, SECRET, { subject: account.username });
    }

    static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, SECRET) as JwtPayload;
    }
}
