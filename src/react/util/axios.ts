import axios, { AxiosInstance } from "axios";

let api: AxiosInstance;

export const setApi = (apiPort: number) => {
  api = axios.create({
    baseURL: `http://localhost:${apiPort}/api/anime`,
  });
};

export const useApi = () => api;
