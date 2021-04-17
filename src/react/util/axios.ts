import axios, { AxiosInstance } from "axios";

let api: AxiosInstance;

export const setApi = (apiPort: number) => {
  api = axios.create({
    baseURL: `http://localhost:${apiPort}`,
  });
};

export const useApi = () => {
  return api;
};