import React, { useEffect } from "react";
import { Routes } from "./navigation/Routes";
import { ApolloProvider } from "@apollo/client";
import { client } from "./util/apollo";
import { ChakraProvider } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { setApi } from "./util/axios";
import { useServerStore, useWelcomeStore } from "./zustand";

const App: React.FC = () => {
  const { getWelcome } = useWelcomeStore();
  const { getServer, setServer, server } = useServerStore();

  ipcRenderer.on("RESPONSE_API_ENDPOINT", (_: any, arg: any) => {
    setApi(parseInt(arg));
    setServer("loaded");
    ipcRenderer.removeAllListeners("RESPONSE_API_ENDPOINT");
  });

  useEffect(() => {
    getWelcome(); //fetch from localStorage
    getServer(server); //send message with ipcRenderer
  }, []);

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Routes />
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
