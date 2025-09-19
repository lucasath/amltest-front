import axios from "axios";

const api = axios.create({
    baseURL: process.env.URL_API,
    withCredentials: true,
});

export default api;
