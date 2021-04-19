import { Auth, UserPrefs } from "./storage/dbSchema";
import { Store } from "./storage/store";

const store = new Store();

var auth: Auth;
var prefs: UserPrefs;

export const setAuth = async (token: string) => {
  const date = new Date();
  //anilist tokens expire in one year (365 days).
  //set to one day before to avoid timezone related issues.
  const expiracyDate = new Date(
    `${date.getFullYear() + 1}-${date.getMonth()}-${date.getDate() - 1}`
  ).toISOString();
  auth = { token, expiracyDate };

  //persist auth object
  await store.write({
    auth,
  });
};

export const useAuth = async (): Promise<Auth> => {
  if (!auth) {
    const saved = await store.read<Auth>({ auth: {} });
    if (saved) {
      auth = saved;
    }
  }

  return auth;
};

export const setPrefs = async (userPrefs: UserPrefs) => {
  prefs = userPrefs;
  await store.write({
    userPrefs,
  });
};

export const usePrefs = async (): Promise<UserPrefs> => {
  if (!prefs) {
    const saved = await store.read<UserPrefs>({ userPreferences: {} });
    if (saved) {
      prefs = saved;
    }
  }

  return prefs;
};
