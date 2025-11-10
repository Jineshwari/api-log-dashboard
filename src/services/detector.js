import Anomaly from "../models/Anomaly.js";

// map endpoints to allowed methods (extend as needed)
const endpointAllowedMethods = {
  "/api/cart/add": ["POST"],
  "/api/cart": ["GET"],
  "/api/login": ["POST"],
  "/api/users": ["GET","POST"],
};

const SQL_PATTERNS = [
  /\bselect\b/i, /\bunion\b/i, /\bdrop\b/i, /\binsert\b/i, /--/, /;--/,
  /\/\*/, /\b1\s*=\s*1\b/, /\bxp_/i, /\bexec\b/i, /sleep\(/i, /benchmark\(/i
];

function checkSQLInjection(log) {
  const body = JSON.stringify(log.body || "") + " " + JSON.stringify(log.query || "");
  const found = SQL_PATTERNS.some(p => p.test(body));
  return found ? { hit:true, reason:"SQL-like payload detected", severity:"critical", score:0.9 } : { hit:false };
}

function checkHighLatency(log, mean=200, std=100) {
  const rt = Number(log.response_time_ms ?? log.log_response_time ?? 0);
  if (rt > mean + 3*std) return { hit:true, reason:`rt ${rt} > mean+3std`, severity:"critical", score:0.8 };
  if (rt > 500) return { hit:true, reason:`rt ${rt} > 500ms`, severity:"warning", score:0.6 };
  return { hit:false };
}

function checkSuspiciousMethod(log) {
  const ep = log.endpoint || log.url || "/";
  const method = (log.http_method || "GET").toUpperCase();
  const allowed = endpointAllowedMethods[ep] || ["GET","POST"];
  if (!allowed.includes(method)) return { hit:true, reason:`${method} not allowed for ${ep}`, severity:"warning", score:0.6 };
  return { hit:false };
}

export async function detectAndSave(log) {
  const results = [];
  const a = checkSQLInjection(log); if (a.hit) results.push(["sql_injection", a]);
  const b = checkHighLatency(log); if (b.hit) results.push(["high_response_time", b]);
  const c = checkSuspiciousMethod(log); if (c.hit) results.push(["suspicious_method", c]);

  for (const [type, r] of results) {
    await Anomaly.create({
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
      service: log.service_name || log.service,
      endpoint: log.endpoint || log.url || "/",
      anomaly_type: type,
      severity: r.severity,
      score: r.score,
      reason: r.reason,
      raw_log: log
    });
  }
}
