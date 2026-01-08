import "./KPICard.css";

export default function KPICard({ title, value }) {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
