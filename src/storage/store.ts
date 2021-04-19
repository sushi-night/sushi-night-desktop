import { app } from "electron";
import Datastore from "nedb-promises";
import dbSchema from "./dbSchema";

export class Store {
  dbPath: string = app.getAppPath() + "/storage.db";
  schema?: dbSchema;
  db?: Datastore;

  constructor() {
    this.db = Datastore.create({
      filename: this.dbPath,
      timestampData: true,
    });
  }

  async write(data: dbSchema) { //find a better way to do this?
    if (data.auth) {
      await this.db.update("auth", data.auth, { upsert: true });
    }
    if (data.userPrefs) {
      await this.db.update("userPrefs", data.userPrefs, { upsert: true });
    }
  }

  async read<T>(key:string) {
    return await this.db.findOne<T>({key});
  }
}
