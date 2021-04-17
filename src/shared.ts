import { Store } from "./storage/store";
import { Auth, UserPrefs } from "./storage/dbSchema";

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

//TODO: Find a way to not need to cast as any to return.
export const useAuth = async (): Promise<Auth> => {
  if (!auth) {
    const saved = await store.read("auth");
    if (saved) {
      auth = saved as any;
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
    const saved = await store.read("userPrefs");
    if (saved) {
      prefs = saved as any;
    }
  }

  return prefs;
};
