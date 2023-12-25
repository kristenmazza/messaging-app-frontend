import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../constants.ts';

const axiosApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default axiosApi;
