import LoginData from "../model/LoginData";

export default interface AccountingService {
    login(loginData: LoginData): string ;
}