import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (err) {
  console.log(err);
  alert(err.response?.data || err.message || "Login failed");
}
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="logo">Fixora</h2>
        <h3>Welcome back</h3>
        

        <label>Email Address</label>
        <input
          type="email"
          placeholder="you@company.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Sign In →</button>
      </div>
    </div>
  );
}

export default Login;