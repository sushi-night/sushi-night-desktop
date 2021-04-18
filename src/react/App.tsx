import React from "react";
import { Routes } from "./navigation/Routes";
import { useApi } from "./util/axios";
import { ApolloProvider } from "@apollo/client";
import { client } from "./util/apollo";
import { ChakraProvider } from "@chakra-ui/react";

const App: React.FC = () => {
  return <Routes />;
};

export default App;
