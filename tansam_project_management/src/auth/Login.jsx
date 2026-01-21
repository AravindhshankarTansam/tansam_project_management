import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import tansamLogo from "../../src/assets/tansam/tansamoldlogo (1).png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./CSS/Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      navigate(data.route);
    } catch (err) {
      // ✅ SHOW TOAST ERROR
      toast.error(err.message || "Invalid email or password", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-stage">
      {/* ✅ TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* animated aura */}
      <div className="aura aura-1"></div>
      <div className="aura aura-2"></div>

      {/* floating particles */}
      <span className="particle p1"></span>
      <span className="particle p2"></span>
      <span className="particle p3"></span>

      <div className="login-card">
        <div className="logo-wrapper">
          <img src={tansamLogo} alt="TANSAM Logo" className="login-logo" />
        </div>

        <h2 className="login-title">Project Management System</h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
