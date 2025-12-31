import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Roles from "./components/Roles";

export default function RoutesWrapper() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/roles" element={<Roles />} />
    </Routes>
  );
}
