import { app, BrowserWindow, ipcMain, shell } from "electron";
import { setAuth } from "../shared";
import { authenticationURL } from "../Constants";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 500,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    center: true,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
require("./server");
require("../shared"); //initialize store object

ipcMain.on("START_AUTH", (event, _) => {
  const authenticationWindow = new BrowserWindow({
    height: 600,
    width: 400,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    center: true,
    alwaysOnTop: true,
    maximizable: false,
    minimizable: false,
    skipTaskbar: true,
    resizable: false,
  });

  authenticationWindow.loadURL(authenticationURL);

  authenticationWindow.webContents.on("will-redirect", async (__, url) => {
    const token = url.split("#access_token=").pop().split("&")[0];
    setAuth(token);
    event.reply("END_AUTH", "will-redirect");
    authenticationWindow.close();
  });

  authenticationWindow.on("close", () => {
    event.reply("END_AUTH", "close");
  });
});

