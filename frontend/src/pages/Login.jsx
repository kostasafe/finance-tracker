import { useState } from "react";
import api from "../api";

function Login() {
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
        <div>
            <h2>Login</h2>

            <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            />

            <br />
            <br />

            <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleLogin}>
                Login
            </button>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
                Logout
            </button>
            <br />

            <button onClick={fetchUserData}>
                Get Current User
            </button>

            {user && (
                <div>
                    <h3>User Info:</h3>
                    <p>ID: {user.id}</p>
                    <p>Username: {user.username}</p>
                </div>
            )}
        </div>
    );
}

export default Login;