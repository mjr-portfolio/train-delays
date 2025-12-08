import axios from "axios";

const BASE_URL = "https://train-delays-production.up.railway.app";

export const api = axios.create({
  baseURL: BASE_URL,
});
