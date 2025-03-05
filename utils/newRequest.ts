import axios from 'axios';
import 'dotenv/config';
export const newRequest = axios.create({
  baseURL: `${process.env.API_URL}`,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const newRequestSecond = axios.create({
  baseURL: `${process.env.SECOND_API_URL}`,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
