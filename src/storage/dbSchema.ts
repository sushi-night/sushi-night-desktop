export default interface dbSchema {
  auth?: Auth;
  userPrefs?: UserPrefs;
}

export type UserPrefs = {
  darkMode?: boolean;
  useTorrent?: boolean;
};

export type Auth = {
  token?: string;
  expiracyDate?: string;
};
