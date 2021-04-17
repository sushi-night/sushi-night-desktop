import { makeUrl } from "expo-linking";
import { Platform } from "react-native";
import { CLIENT_ID_DESKTOP, CLIENT_ID_MOBILE } from "./anilist.config";

const authenticationEndpoint = (ID: number) =>
  `https://anilist.co/login?apiVersion=v2&client_id=${ID}&response_type=token`;

export const { OS } = Platform;

export const authenticationURL = authenticationEndpoint(
  OS === "web" ? CLIENT_ID_DESKTOP : CLIENT_ID_MOBILE
);

export const redirectURL = makeUrl(); //TODO: replace this with the API endpoint running in node, for now this will work.

export const images = {
  appLogo: require("../static/logo.png")
};