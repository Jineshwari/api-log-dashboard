import "dotenv/config";
import mongoose from "mongoose";
import ParsedLog from "../models/ParsedLog.js";
import { detectAndSave } from "../services/detector.js";

const { MONGO_URI } = process.env;

const base = {
  request_size_bytes: 8192,
  response_size_bytes: 23552,
  hour_sin: 0, hour_cos: 1, dow_sin: 0, dow_cos: 1,
  endpoint_enc: 4, http_method_enc: 0, service_name_enc: 4, geo_location_enc: 0,
  req_resp_ratio: 2.874649090687172,
  normalized_latency: 0.0070054770092981,
  log_request_size: 9.011035410141815,
  log_response_size: 10.067008479866365,
  log_response_time: 5.111987788356544
};

const samples = [
  { ...base, service_name: "cart-service", endpoint: "/api/cart/add", http_method: "POST", response_time_ms: 165, status_code: 200, timestamp: "2025-09-01T00:00:12" },
  { ...base, service_name: "cart-service", endpoint: "/api/cart/add", http_method: "GET",  response_time_ms: 180, status_code: 200, timestamp: "2025-09-01T00:01:12" }, // suspicious method
  { ...base, service_name: "payment-service", endpoint: "/api/pay", http_method: "POST", response_time_ms: 820, status_code: 200, timestamp: "2025-09-01T00:02:12" }, // high latency
  { ...base, service_name: "order-service", endpoint: "/api/orders", http_method: "GET", response_time_ms: 210, status_code: 200, timestamp: "2025-09-01T00:03:12", body: "id=1; UNION SELECT password FROM users --" } // SQLi
];

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log("connected");

  for (const log of samples) {
    await ParsedLog.create(log);
    await detectAndSave(log);
  }

  console.log("seeded");
  await mongoose.disconnect();
  process.exit(0);
})();

