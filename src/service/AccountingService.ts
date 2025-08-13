import LoginData from "../model/dto-types/LoginData";

export default interface AccountingService {
  login(loginData: LoginData): string;
}
