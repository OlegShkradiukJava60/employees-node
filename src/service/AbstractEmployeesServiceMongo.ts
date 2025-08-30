import { Collection, Db, MongoClient } from "mongodb";
import { Employee } from "../model/dto-types/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from "../model/error-types/employee-error.ts";
import { getId } from "../utils/service-helpers.ts";
export default abstract class AbstractEmployeesServiceMongo implements EmployeesService {
    client: MongoClient;
    db: Db;
    collection: Collection<Employee>;
    constructor(uri: string, private dbName: string, private collectionName: string) {
        this.client = new MongoClient(uri);
    }
    async init(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
        this.collection.createIndex({id: 1},{unique: true});
        this.collection.createIndex({department: "hashed"})
    }
    async addEmployee(empl: Employee): Promise<Employee> {
    if(!("id" in empl)){
        empl.id = getId()
    }
    try {
      await this.collection.insertOne(empl);
      return empl;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new EmployeeAlreadyExistsError(empl.id);
      }
      throw error;
    }
  }
    async getAll(department?: string): Promise<Employee[]> {
        const filter = department ? {department}: {};
        return await this.collection.find(filter).toArray()
    }
   async updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee> {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: empl },
      { returnDocument: "after" }
    );
    if (!result) {
      throw new EmployeeNotFoundError(id);
    }
    return result;
  }
    async deleteEmployee(id: string): Promise<Employee> {
    const result = await this.collection.findOneAndDelete({ id });
    if (!result) {
      throw new EmployeeNotFoundError(id);
    }
    return result;
  }
    async getEmployee(id: string): Promise<Employee> {
        const empl =  await this.collection.findOne({id});
        if (!empl) {
            throw new EmployeeNotFoundError(id);
        }
        return empl;
    }
    async save(): Promise<void> {
        await this.client.close();
        
    }

}