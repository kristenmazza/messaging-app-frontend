import axios, { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const axiosApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default axiosApi;
