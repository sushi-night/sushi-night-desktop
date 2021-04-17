import React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { setApi } from "./util/axios";
const { ipcRenderer } = window.require("electron");

ipcRenderer.send("GET_API_ENDPOINT", "ping");
ipcRenderer.on("RESPONSE_API_ENDPOINT", (_: any, arg: any) => {
  setApi(parseInt(arg));
  console.log("port", arg);
  ReactDOM.render(<App />, document.getElementById("root"));
});

//render only if everything worked
