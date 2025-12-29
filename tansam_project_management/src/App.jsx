import { useState } from "react";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <AdminDashboard />
  ) : (
    <Login setIsLoggedIn={setIsLoggedIn} />
  );
}

export default App;
