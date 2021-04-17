import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuth } from "../util/auth";
import { ANILIST_ENDPOINT } from "./anilist.config";

//every time apollo makes a request, this function gets called.
//if there's a token it will set it in headers.
const authLink = setContext((_, { headers }) => {
  const token = getAuth().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  uri: ANILIST_ENDPOINT,
  cache: new InMemoryCache(),
  link: authLink
});
