
export default function TLTopBar() {
  return (
    <header style={styles.topbar}>
      <h4>Team Leader Dashboard</h4>
      <button>Logout</button>
    </header>
  );
}

const styles = {
  topbar: {
    height: "60px",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #e5e7eb",
  },
};
