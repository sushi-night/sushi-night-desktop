import { CLIENT_ID_DESKTOP } from "./anilist.config";

const authenticationEndpoint = (ID: number) =>
  `https://anilist.co/login?apiVersion=v2&client_id=${ID}&response_type=token`;

export const authenticationURL = authenticationEndpoint(CLIENT_ID_DESKTOP);

import appLogo from "./static/logo.png";
import serverStarting from "./static/serverStarting.gif";

export { appLogo, serverStarting };
export const textColor = "rgb(159,173,189)";
