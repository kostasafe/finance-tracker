import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { getToken, setToken, removeToken } from "../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData);
      const accessToken = response.data?.access_token;

      if (!accessToken) {
        setError("Login failed. Please try again.");
        return;
      }

      setToken(accessToken);
      api.setAuthToken(accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    api.setAuthToken(null);
    navigate("/");
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-badge">Finance Tracker</span>
          <h2>Welcome back</h2>
          <p>Sign in to manage your spending, track transactions, and stay in control of your finances.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}

          <label className="form-group">
            <span>Username</span>
            <input
              className="login-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="form-group">
            <span>Password</span>
            <input
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <div className="login-actions">
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button type="button" className="button secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
