import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "../../shared";
import { ANILIST_ENDPOINT } from "../../anilist.config";

//every time apollo makes a request, this function gets called.
//if there's a token it will set it in headers.
const authLink = setContext(async (_, { headers }) => {
  const token = useAuth().token;
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
  link: ApolloLink.from([authLink, new HttpLink({ uri: ANILIST_ENDPOINT })]),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
