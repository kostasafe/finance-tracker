import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Do not auto-restore a token from previous sessions.
// Tokens are set explicitly after a successful login in the UI.

export default api;
