export default function AnomaliesTable({ items = [], onResolve }) {
  const badge = (sev) =>
    sev === "critical" ? "badge danger" : sev === "warning" ? "badge warn" : "badge ok";

  return (
    <div className="panel">
      <h3 className="h">Anomalies</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Time</th><th>Service</th><th>Endpoint</th><th>Type</th><th>Severity</th><th>Reason</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan="7" className="subtle">No anomalies found for current filters.</td></tr>
          )}
          {items.map(a => (
            <tr key={a._id}>
              <td>{new Date(a.timestamp).toLocaleString()}</td>
              <td>{a.service || "—"}</td>
              <td style={{maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                {a.endpoint || "/"}
              </td>
              <td>{a.anomaly_type}</td>
              <td><span className={badge(a.severity)}>{a.severity}</span></td>
              <td title={a.reason} style={{maxWidth:340, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                {a.reason}
              </td>
              <td>
                {!a.resolved && (
                  <button className="button" onClick={() => onResolve(a._id)}>Resolve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
