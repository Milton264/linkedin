import axios from "axios";

export const ENDPOINT = "http://localhost:8081/api";

export const api = axios.create({ baseURL: ENDPOINT });
