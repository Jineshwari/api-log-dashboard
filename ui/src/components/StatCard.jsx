export default function StatCard({ label, value, hint }) {
  return (
    <div className="panel">
      <div className="subtle">{label}</div>
      <div className="kpi">{value ?? "—"}</div>
      {hint && <div className="subtle">{hint}</div>}
    </div>
  );
}
