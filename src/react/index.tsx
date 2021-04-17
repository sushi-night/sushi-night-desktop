import React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { Loading } from "./Loading";
import { setApi } from "./util/axios";
const { ipcRenderer } = window.require("electron");

const root: HTMLElement = document.getElementById("root");

ReactDOM.render(
  <div style={{ height: "100vh" }}>
    <Loading />
  </div>,
  root
);

//render the app only if the server is working
ipcRenderer.send("GET_API_ENDPOINT");
ipcRenderer.on("RESPONSE_API_ENDPOINT", (_: any, arg: any) => {
  setApi(parseInt(arg));
  //unmount the loading component
  ReactDOM.unmountComponentAtNode(root);
  ReactDOM.render(<div style={{ height: "100vh" }}><App /></div>, root);
});
