import { app } from "electron";
import Datastore from "nedb-promises";
import dbSchema, { Auth, UserPrefs } from "./dbSchema";

export class Store {
  dbPath: string =
    (app || require("electron").remote.app).getAppPath() + "/storage.db"; //when ./shared is imported from frontend app is not defined? temporary fix for now, will check later.
  schema?: dbSchema;
  db?: Datastore;

  constructor() {
    this.db = Datastore.create({
      filename: this.dbPath,
      timestampData: true,
    });
  }

  async write(data: dbSchema) {
    if (data.auth) {
      await this.db.update<Auth>(
        { "auth.token": /[^]/g },
        { auth: data.auth },
        { upsert: true }
      );
    }
    if (data.userPrefs) {
      await this.db.update<UserPrefs>(
        { "userPreferences.darkMode": /[^]/g },
        { userPreferences: data.userPrefs },
        {
          upsert: true,
        }
      );
    }
  }
}
