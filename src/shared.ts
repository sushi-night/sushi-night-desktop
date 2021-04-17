import { Store } from "./storage/store";

const store = new Store();

interface IAuth {
  token: string;
  expiracyDate: string;
}

type Auth = IAuth | {};

var auth: Auth;

//anilist tokens expire in one year (365 days).
export const setAuth = async (token: string) => {
  const date = new Date();
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
    const saved = await store.read("auth");
    if (saved) {
      auth = saved;
    }
  }

  return auth;
};