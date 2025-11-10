import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from .env
});

// ✅ Get anomalies
export const fetchAnomalies = (params) =>
  api.get("/anomalies", { params }).then((res) => res.data);

// ✅ Resolve anomaly
export const resolveAnomaly = (id) =>
  api.patch(`/anomalies/${id}/resolve`).then((res) => res.data);

// ✅ Get metrics (with STATIC fallback)
export const fetchMetrics = async (params) => {
  try {
    const res = await api.get("/metrics/summary", { params });
    const data = res.data;

    // if backend returns no metrics → Use static sample data
    if (!data || Object.keys(data).length === 0) {
      console.log("⚠️ Using STATIC fallback metrics (no real metrics found)");

      return {
        requestsPerService: [
          { service: "cart-service", count: 1200 },
          { service: "order-service", count: 980 },
          { service: "payment-service", count: 760 },
        ],
        avgResponseTimePerService: [
          { service: "cart-service", avg: 180 },
          { service: "order-service", avg: 320 },
          { service: "payment-service", avg: 450 },
        ],
        errorCountsPerService: [
          { service: "cart-service", count: 2 },
          { service: "order-service", count: 0 },
          { service: "payment-service", count: 1 },
        ],
      };
    }

    return data;
  } catch (err) {
    console.log("⚠️ Metrics API down → Using STATIC fallback metrics");

    // If request itself fails, still return static data
    return {
      requestsPerService: [
        { service: "cart-service", count: 1200 },
        { service: "order-service", count: 980 },
        { service: "payment-service", count: 760 },
      ],
      avgResponseTimePerService: [
        { service: "cart-service", avg: 180 },
        { service: "order-service", avg: 320 },
        { service: "payment-service", avg: 450 },
      ],
      errorCountsPerService: [
        { service: "cart-service", count: 2 },
        { service: "order-service", count: 0 },
        { service: "payment-service", count: 1 },
      ],
    };
  }
};

export default api;
