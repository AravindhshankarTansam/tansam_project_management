import { useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // ✅ added

  return isLoggedIn ? (
    <AdminDashboard />
  ) : (
    <Login
      setIsLoggedIn={setIsLoggedIn}
      setUser={setUser}   // ✅ added
    />
  );
}

export default App;
