import LoginData from "../model/dto-types/LoginData";
import LoginResponse from "../model/dto-types/LoginResponse";

export default interface AccountingService {
  login(loginData: LoginData): LoginResponse;
}
