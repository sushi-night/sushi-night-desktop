import { ColorModeScript } from "@chakra-ui/color-mode";
import React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "focus-visible/dist/focus-visible"; //get rid of the ugly blue outlines of chakra

ReactDOM.render(
  <div style={{ height: "100vh" }}>
    <React.StrictMode>
      <ColorModeScript />
      <App />
    </React.StrictMode>
  </div>,
  document.getElementById("root")
);
