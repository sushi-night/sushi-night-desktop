import { Auth, UserPrefs } from "./storage/dbSchema";
import { factory } from "electron-json-config";

const store = factory();

var auth: Auth;
var prefs: UserPrefs;

export const setAuth = (token: string) => {
  const date = new Date();
  //anilist tokens expire in one year (365 days).
  //set to one day before to avoid timezone related issues.
  const expiracyDate = new Date(
    `${date.getFullYear() + 1}-${date.getMonth()}-${date.getDate() - 1}`
  ).toISOString();
  auth = { token, expiracyDate };

  //persist auth object
  store.set<Auth>("auth", auth);
};

export const useAuth = (): Auth => {
  if (!auth) {
    auth = store.get<Auth>("auth");
  }
  return auth;
};

export const setPrefs = (userPrefs: UserPrefs) => {
  prefs = userPrefs;
  store.set<UserPrefs>("userPreferences", userPrefs);
};

export const usePrefs = (): UserPrefs => {
  if (!prefs) {
    prefs = store.get<UserPrefs>("userPreferences");
  }
  return prefs;
};
