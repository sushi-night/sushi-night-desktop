export default interface dbSchema {
  auth?: {
    token?: string;
    expiracyDate?: string;
  };
  userPrefs?: {
    darkMode?: boolean;
    useTorrent?: boolean;
  };
}