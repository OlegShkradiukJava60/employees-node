import { Employee } from "../model/Employee";
import EmployeesService from "./EmployeesService";

export default class EmployeesServiceMap implements EmployeesService {
    employees: Map<string, Employee> = new Map();
//TODO
}