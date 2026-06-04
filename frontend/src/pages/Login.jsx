import { useState } from "react";
import api from "../api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const formData = new URLSearchParams();

            formData.append("username", username);
            formData.append("password", password);

            const response = await api.post(         //Wait for FastAPI to answer before continuing.
                "/auth/login",
                formData
            );

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
        </div>
    );
}

export default Login;