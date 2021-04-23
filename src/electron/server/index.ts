import getPort from "get-port";
import { ipcMain } from "electron";
import { app } from "sushi-night-backend";

let port: number;

(async () => {
  port = await getPort({ port: 3000 }); //if 3000 is used pick another one.

  app.listen(port);
})();

ipcMain.on("GET_API_ENDPOINT", (event, _) => {
  event.reply("RESPONSE_API_ENDPOINT", port);
});
