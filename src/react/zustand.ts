import { ipcRenderer } from "electron";
import create, { State } from "zustand";

interface WelcomeState extends State {
  welcome: boolean;
  setWelcome: (welcome: boolean) => void;
  getWelcome: () => void;
}

type svState = "loaded" | "loading";

interface ServerState extends State {
  server: svState;
  setServer: (state: svState) => void;
  getServer: (state: svState) => void;
}

interface AuthState extends State {
  authenticated: boolean;
  setAuthenticated: (state: boolean) => void;
}


export const useWelcomeStore = create<WelcomeState>((set) => ({
  welcome: false,
  getWelcome: () => {
    const w = localStorage.getItem("welcome") == "1" ? true : false;
    set((_) => ({
      welcome: w,
    }));
  },
  setWelcome: (welcome: boolean) => {
    localStorage.setItem("welcome", welcome ? "1" : "0"); //don't show the welcome page again
    set((_) => ({
      welcome,
    }));
  },
}));

export const useServerStore = create<ServerState>((set) => ({
  server: "loading",
  getServer: (server: svState) => {
    if (server !== "loaded") {
      ipcRenderer.send("GET_API_ENDPOINT");
    }
  },
  setServer: (state: svState) => {
    set((_) => ({
      server: state,
    }));
  },
}));

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {
    set((_) => ({
      authenticated,
    }));
  },
}));
