import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ title, labels = [], values = [] }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: "rgba(80, 150, 255, 0.7)", // brighter blue
        borderColor: "rgba(80, 150, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    color: "#fff",
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: "#ddd" } },
      y: { ticks: { color: "#ddd" } },
    }
  };

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
