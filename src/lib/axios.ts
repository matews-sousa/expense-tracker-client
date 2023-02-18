import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers!.Authorization = `Bearer ${token}`;
    return config;
})

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const {response} = error;
    if (response.status === 401) {
        localStorage.removeItem("ACCESS_TOKEN");
    }
    throw error;
})

export default api;