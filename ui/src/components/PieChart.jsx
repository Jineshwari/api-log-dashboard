import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const data = {
    labels: ["cart-service", "order-service", "payment-service"],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: [
          "rgba(100, 149, 237, 0.9)",
          "rgba(255, 182, 73, 0.9)",
          "rgba(255, 99, 132, 0.9)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#1a1e2e] p-5 rounded-xl border border-[#2b3143] shadow-md">
      <h3 className="text-white mb-3">Request Distribution</h3>
      <Pie data={data} />
    </div>
  );
}
