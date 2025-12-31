import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./AdminDashboard";
import Roles from "./components/Roles";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/roles" element={<Roles />} />
    </Routes>
  );
}

export default App;
