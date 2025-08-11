import jwt, { JwtPayload } from 'jsonwebtoken'
import Account from '../model/Account';
export default class JwtUtil {
    static getJWT(account: Account): string {
        return jwt.sign({role: account.role}, process.env.JWT_SECRET, {
            subject: account.username
        })
    }
    static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    }
}