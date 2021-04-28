import { ipcRenderer } from "electron";
import create, { State } from "zustand";
import { Media } from "./generated/graphql";

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
  authenticated?: number;
  setAuthenticated: (id?: number) => void;
}

interface AnimeState extends State {
  //save the animeId instead of the object, as this can be of different types depending on where it comes from, whenever it's necessary to load its data, re-fetch it with useAnime($id) query.
  animeId?: number;
  setAnimeId: (animeId: number) => void;
}

export interface Watch {
  anime: Media;
  gogoId: string;
  episode: number;
}

interface WatchState extends State {
  //save the animeId instead of the object, as this can be of different types depending on where it comes from, whenever it's necessary to load its data, re-fetch it with useAnime($id) query.
  watch: Watch | null;
  setWatch: (watch: Watch) => void;
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
  userId: null,
  setAuthenticated: (authenticated?: number) => {
    set((_) => ({
      authenticated,
    }));
  },
}));

export const useAnimeState = create<AnimeState>((set) => ({
  animeId: undefined,
  setAnimeId: (animeId: number) => {
    set((_) => ({
      animeId,
    }));
  },
}));

export const useWatchState = create<WatchState>((set) => ({
  watch: null,
  setWatch: (watch: Watch) => {
    set((_) => ({
      watch,
    }));
  },
}));
