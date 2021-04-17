import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { authenticationURL, redirectURL } from "./Constants";

interface authentication {
  token?: string;
  expiresIn?: number;
}

var auth: authentication;

export const setAuth = (params: authentication) => {
  auth = { token: params.token, expiresIn: params.expiresIn };
};

export const getAuth = (): authentication => {
  return auth;
};

export const login = async () => {
  console.log("login function");
};

//this probably only works on mobile, in browser it's not working.
// export const login = async () => {
//   let result = await openAuthSessionAsync(authenticationURL, redirectURL);
//   if ((result as any).url) {
//     const { url } = result as any;
//     let token = url.split("#access_token=").pop().split("&")[0];
//     console.log(token);
//     setAuth(token);
//     return true;
//   } else {
//     console.log(result.type);
//     return false;
//   }
// };
