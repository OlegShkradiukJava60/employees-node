import Account from "../model/dto-types/Account.ts";
import LoginData from "../model/dto-types/LoginData.ts";
import LoginResponse from "../model/dto-types/LoginResponse.ts";
import { LoginError } from "../model/error-types/employee-error.ts";
import JwtUtil from "../security/JwtUtil.ts";
import AccountingService from "./AccountingService.ts";
import { compareSync } from "bcrypt-ts";
class AccountingServiceMap implements AccountingService {
  private _accounts: Map<string, Account> = new Map();
  constructor() {
    this._accounts.set("user@tel-ran.com", {
      username: "user@tel-ran.com",
      role: "USER",
      password: "$2a$10$6las4Eq5ZomDpGRxrALDbeOxEoVg2lHoGQ9vsa5VFhjomrDFfpxt.",
    });
    this._accounts.set("admin@tel-ran.com", {
      username: "admin@tel-ran.com",
      role: "ADMIN",
      password: "$2a$10$OBu/N8Q0WVw64T7pLkUPiOY7gBsz..VfCQswHsp.Iu3yGfSkWOaZy",
    });
  }
  login(loginData: LoginData): LoginResponse {
    const account: Account = this._accounts.get(loginData.email);

    if (!account || !compareSync(loginData.password, account.password)) {
      throw new LoginError();
    }
    return {
      accessToken: JwtUtil.getJWT(account),
      user: {
        email: account.username,
        id: account.role
      }
    };
  }
}
const accountingService = new AccountingServiceMap();
export default accountingService;
