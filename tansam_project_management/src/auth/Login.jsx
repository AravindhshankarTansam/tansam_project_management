import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./CSS/Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    console.log("📤 Sending login data:", { email, password });

    const data = await loginUser(email, password);
    console.log("📥 Login API response:", data);

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));

    // ✅ Redirect based on role
  if (data.role === "finance") {
  // If mock or backend doesn't provide route, hardcode it
  navigate(data.route || "/finance/dashboard");
} else if (data.role === "admin") {
  navigate(data.route || "/admin");
}
else {
      // fallback
      navigate("/");
    }

  } catch (err) {
    console.error("❌ Login error:", err);
    setError(err.message || "Backend not reachable");
  } finally {
    setLoading(false);
  }
};
;

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      

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

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default Login;
