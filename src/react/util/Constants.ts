import { CLIENT_ID_DESKTOP } from "./anilist.config";

const authenticationEndpoint = (ID: number) =>
  `https://anilist.co/login?apiVersion=v2&client_id=${ID}&response_type=token`;

export const authenticationURL = authenticationEndpoint(
  CLIENT_ID_DESKTOP
);

export const redirectURL = "" //TODO: replace this with the API endpoint running in node, for now this will work.

export const images = {
  appLogo: require("../../static/logo.png")
};