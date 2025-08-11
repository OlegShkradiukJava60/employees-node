import Account from "../model/Account.ts";
import LoginData from "../model/LoginData.ts";
import JwtUtil from "../security/JwtUtil.ts";
import AccountingService from "./AccountingService.ts";
import { compareSync } from "bcrypt-ts";
 class AccountingServiceMap implements AccountingService {
    private _accounts: Map<string,Account> = new Map();
    constructor() {
        this._accounts.set("user@tel-ran.com", {username: "user@tel-ran.com", role: "USER",
            password: "$2a$10$6las4Eq5ZomDpGRxrALDbeOxEoVg2lHoGQ9vsa5VFhjomrDFfpxt." });
        this._accounts.set("admin@tel-ran.com", {username:"admin@tel-ran.com",role: "USER",
            password: "$2a$10$OBu/N8Q0WVw64T7pLkUPiOY7gBsz..VfCQswHsp.Iu3yGfSkWOaZy"
         })   
       
    }
    login(loginData: LoginData): string {
        const account: Account = this._accounts.get(loginData.email);

        if (!account || !compareSync(loginData.password, account.password)) {
            throw new Error("Wrong credentials")
        }
        return JwtUtil.getJWT(account);
    }
    
}
const accountingService = new AccountingServiceMap();
export default accountingService;