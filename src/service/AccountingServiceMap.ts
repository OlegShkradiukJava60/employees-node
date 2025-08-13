// src/service/AccountingServiceMap.ts
import Account from "../model/Account.ts";
import LoginData from "../model/LoginData.ts";
import JwtUtil from "../security/JwtUtil.ts";
import AccountingService from "./AccountingService.ts";
import { compareSync, hashSync } from "bcrypt-ts";

class AccountingServiceMap implements AccountingService {
    private _accounts: Map<string, Account> = new Map();

    constructor() {
        const USER_PASS = process.env.USER_PASS || "user123";
        const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

        const userHash = hashSync(USER_PASS, 10);
        const adminHash = hashSync(ADMIN_PASS, 10);

        this._accounts.set("user@tel-ran.com", {
            username: "user@tel-ran.com",
            role: "USER",
            password: userHash,
        });

        this._accounts.set("admin@tel-ran.com", {
            username: "admin@tel-ran.com",
            role: "ADMIN",
            password: adminHash,
        });
    }

    login(loginData: LoginData): string {
        const account: Account | undefined = this._accounts.get(loginData.email);

        if (!account || !compareSync(loginData.password, account.password)) {
            throw new Error("Wrong credentials");
        }
        return JwtUtil.getJWT(account);
    }
}

const accountingService = new AccountingServiceMap();
export default accountingService;
