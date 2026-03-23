import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://speedhub-6fam.onrender.com/api',
  withCredentials: true,
});