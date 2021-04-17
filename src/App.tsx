import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Routes } from "./navigation/Routes";
import { client } from "./util/apollo";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
} 

export default App;