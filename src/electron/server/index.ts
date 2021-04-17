import express, { Application } from "express";
import cors from "cors";
import { router } from "./api";
import getPort from "get-port";
import { ipcMain } from "electron";

let port: number;

(async () => {
  port = await getPort({ port: 3000 }); //if 3000 is used pick another one.

  const app: Application = express();

  app.use(cors());

  app.use("/api", router);

  app.listen(port, () => ipcMain.emit(`API ON: ${port}`));
})();

ipcMain.on("GET_API_ENDPOINT", (event, _) => {
  event.reply("RESPONSE_API_ENDPOINT", port);
});
