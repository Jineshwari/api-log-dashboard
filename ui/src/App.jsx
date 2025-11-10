import { useEffect, useMemo, useState } from "react";
import { fetchAnomalies, fetchMetrics, resolveAnomaly } from "./lib/api";
import StatCard from "./components/StatCard";
import BarChart from "./components/BarChart";
import AnomaliesTable from "./components/AnomaliesTable";
import StaticCharts from "./components/StaticCharts";   // ✅ ADDED

export default function App() {
  const [loading, setLoading] = useState(true);
  const [anoms, setAnoms] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // filters
  const [type, setType] = useState("");
  const [service, setService] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = async () => {
    setLoading(true);
    const [a, m] = await Promise.all([
      fetchAnomalies({ type, service, from, to }),
      fetchMetrics({ from, to })
    ]);
    setAnoms(a);
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const services = useMemo(() =>
    (metrics?.byService || []).map(s => s._id).filter(Boolean),
    [metrics]
  );

  const onResolve = async (id) => {
    await resolveAnomaly(id);
    load();
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <div className="brand">API_LOG Dashboard</div>
          <div className="subtle">Observability • Anomaly Detection • MongoDB</div>
        </div>

        <div className="controls">
          <select className="select" value={type} onChange={e => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="sql_injection">SQL Injection</option>
            <option value="high_response_time">High Response Time</option>
            <option value="suspicious_method">Suspicious HTTP Method</option>
          </select>

          <select className="select" value={service} onChange={e => setService(e.target.value)}>
            <option value="">All services</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <input className="input" type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="input" type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
          <button className="button primary" onClick={load}>Apply</button>
        </div>
      </div>

      {/* TOP STAT CARDS */}
      <div className="row grid-4" style={{ marginBottom: 16 }}>
        <StatCard label="Total Anomalies" value={anoms.length} />
        <StatCard label="Services (logs)" value={metrics?.byService?.length ?? "—"} />
        <StatCard label="Error services" value={metrics?.errors?.length ?? "—"} />
        <StatCard label="Anomaly Types" value={metrics?.anomalyCounts?.length ?? "—"} />
      </div>

      {/* BAR CHARTS */}
      <div className="row grid-2" style={{ marginBottom: 16 }}>
        <BarChart
          title="Requests per Service"
          labels={(metrics?.byService || []).map(s => s._id || "unknown")}
          values={(metrics?.byService || []).map(s => s.count)}
        />

        <BarChart
          title="Avg Response Time (ms)"
          labels={(metrics?.byService || []).map(s => s._id || "unknown")}
          values={(metrics?.byService || []).map(s => Math.round(s.avgRt))}
        />
      </div>

      {/* ANOMALIES TABLE */}
      <AnomaliesTable items={anoms} onResolve={onResolve} />

      {/* ✅ NEW STATIC VISUALIZATIONS */}
      <StaticCharts /> 

      {loading && <div className="subtle" style={{ marginTop: 8 }}>Loading…</div>}
    </div>
  );
}
