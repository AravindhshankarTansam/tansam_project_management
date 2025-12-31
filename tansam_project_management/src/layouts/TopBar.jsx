export default function TopBar() {
  return (
    <div style={styles.topbar}>
      <span>Welcome, User</span>
      <button style={styles.logout}>Logout</button>
    </div>
  );
}

const styles = {
  topbar: {
    height: "60px",
    background: "#fff",
    color: "#282525ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
};
