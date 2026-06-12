import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        try {
            const formData = new URLSearchParams();

            formData.append("username", username);
            formData.append("password", password);

            const response = await api.post(
                "/auth/login",
                formData
            );

            const accessToken = response.data?.access_token;
            if (!accessToken) {
                console.error("Login response did not include access_token", response.data);
                return;
            }

            // Save token to localStorage and set default Authorization header for future requests.
            localStorage.setItem("access_token", accessToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            console.log("Token saved to localStorage and Authorization header set.");

            // after login success:
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        // Remove the saved token and clear the Authorization header so future requests are unauthenticated.
        localStorage.removeItem("access_token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        console.log("Logged out and cleared stored token.");
    };

    const fetchUserData = async () => {
        try {
            const response = await api.get("/auth/me");
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <div className="login-brand">
                    <span className="login-badge">Finance Tracker</span>
                    <h2>Welcome back</h2>
                    <p>Sign in to manage your spending, track transactions, and stay in control of your finances.</p>
                </div>

                <div className="login-form">
                    <label className="form-group">
                        <span>Username</span>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        />
                    </label>

                    <div className="login-actions">
                        <button type="button" className="button primary" onClick={handleLogin}>
                            Sign in
                        </button>
                        <button type="button" className="button secondary" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <button type="button" className="link-button" onClick={fetchUserData}>
                    Get current user
                </button>

                {user && (
                    <div className="user-card">
                        <h3>User Info</h3>
                        <p>ID: {user.id}</p>
                        <p>Username: {user.username}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;