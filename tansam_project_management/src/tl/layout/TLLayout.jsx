import { Outlet } from "react-router-dom";
import TLSidebar from "./TLSidebar";
import TLTopBar from "./TLTopBar";

export default function TLLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <TLSidebar />

      <div style={{ flex: 1 }}>
        <TLTopBar />
        <main style={{ padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
