import React from "react";
import { useApi } from "./util/axios";

const App: React.FC = () => {
  const api = useApi();
  return (
    <div style={{ marginTop: 30, height: "100vh" }}>
      <div>Hello world</div>
      <div>The API is on: {api.defaults.baseURL}</div>
    </div>
  );
};

export default App;
