import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      console.log("Sending:", username, password);

      await axios.post("http://localhost:5000/auth/signup", {
        username,
        password,
      });

      alert("Signup successful ✅");
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">Fixora</h2>
        <h3>Create Account</h3>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={signup}>Signup →</button>

        <p className="switch">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}