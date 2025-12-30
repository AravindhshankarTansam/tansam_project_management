import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ADMIN ONLY (for now)
  const ADMIN_USER = {
    email: "admin@test.com",
    password: "admin123",
    role: "ADMIN",
    route: "/admin",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
      setError("Invalid admin credentials");
      return;
    }

    setUser({
      email: ADMIN_USER.email,
      role: ADMIN_USER.role,
    });

    navigate(ADMIN_USER.route);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>

      {error && <p className="login-error">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
