import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-django-backend.herokuapp.com/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default api;
