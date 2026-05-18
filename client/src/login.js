import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();   // ✅ inside component

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      // ✅ store in session (not localStorage)
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.setItem("token", res.data.token);

      // ✅ navigate AFTER storing
      const login = async () => {
  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });

    sessionStorage.setItem("user", JSON.stringify(res.data.user));
    sessionStorage.setItem("token", res.data.token);

    // ✅ force reload so Layout can read sessionStorage
    window.location.href = "/dashboard";

  } catch (err) {
    alert("Invalid credentials");
  }
};

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Fixora Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;