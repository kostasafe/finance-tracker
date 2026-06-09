import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Restore saved JWT from localStorage on app start.
// This ensures axios sends Authorization after a page reload.
const token = localStorage.getItem("access_token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
