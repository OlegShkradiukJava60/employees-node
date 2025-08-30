import { MongoMemoryServer } from "mongodb-memory-server";
import AbstractEmployeesServiceMongo from "./AbstractEmployeesServiceMongo.ts";
import { registerEmployeesService } from "./registry.ts";
const EMPLOYEES_DB_NAME = "employees_db", EMPLOYEES_COLLECTION = "employees";
class EmployeesServiceMongoInMemory extends AbstractEmployeesServiceMongo {
    constructor(uri:string, dbName: string, collectionName: string,
         private mongoMemoryServer: MongoMemoryServer) {
        super(uri, dbName, collectionName);
    }
    async save(): Promise<void> {
        await super.save();
        this.mongoMemoryServer.stop();

    }
}
registerEmployeesService("mongoInMemory", async () => {
    const mongoMemoryServer = new MongoMemoryServer();
   await mongoMemoryServer.start()
    const uri = mongoMemoryServer.getUri();
    const serviceInstance = new EmployeesServiceMongoInMemory(uri,
         EMPLOYEES_DB_NAME, EMPLOYEES_COLLECTION, mongoMemoryServer);
    await serviceInstance.init();
    return serviceInstance;     
})