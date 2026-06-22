import axios from "axios";
import { getToken } from "./utils/auth";

const api = axios.create({
  baseURL: window.location.origin,
});

const token = getToken();
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

api.setAuthToken = (authToken) => {
  if (authToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
