const baseURL =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:8000/api"
    : import.meta.env.VITE_BASE_API_URL;

export default baseURL;
