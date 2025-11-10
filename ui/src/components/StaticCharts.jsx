import { Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function StaticCharts() {

  // 1) Average Response Time vs Hour (STATIC)
  const hourlyLabels = [...Array(24).keys()];
  const hourlyData = {
    labels: hourlyLabels,
    datasets: [
      { label: "cart-service", data: [250,255,260,258,255,255,300,300,305,310,310,320,380,380,380,300,295,290,300,400,450,460,300,305], borderColor: "#5AB0FF" },
      { label: "catalog-service", data: [220,225,230,228,225,225,260,260,265,270,270,275,320,320,320,260,258,255,260,350,400,400,260,265], borderColor: "#FFD86A" },
      { label: "order-service", data: [290,292,295,290,288,285,340,340,345,350,350,355,430,435,440,340,338,335,340,540,550,550,340,350], borderColor: "#6AFF6A" },
      { label: "payment-service", data: [350,350,350,350,350,350,420,420,420,420,420,420,550,550,550,420,420,420,430,690,690,690,430,430], borderColor: "#FF6A6A" }
    ]
  };

  // 2) Scatter plot (STATIC pattern look)
  const scatterData = {
    datasets: [
      { label: "payment-service", data: [...Array(400)].map(()=>({x:Math.random()*7,y:600+Math.random()*400})), backgroundColor:"#FF6A6A" },
      { label: "cart-service", data: [...Array(400)].map(()=>({x:Math.random()*7,y:150+Math.random()*150})), backgroundColor:"#5AB0FF" },
    ]
  };

  // 3) Simple static service metrics bar chart
  const staticServiceData = {
    labels: ["cart","quote","currency","frontend-proxy"],
    datasets: [{ label:"Request Time", data:[90,75,45,110], backgroundColor:"rgba(80, 150, 255, 0.7)" }]
  };

  return (
    <div style={{marginTop:30}}>
      <h2 style={{color:"#fff"}}>Extra Static Metrics</h2>

      <h3 style={{color:"#fff"}}>Average Response Time vs Hour</h3>
      <Line data={hourlyData} />

      <h3 style={{color:"#fff", marginTop:20}}>Response Time Over Days (Pattern Simulation)</h3>
      <Scatter data={scatterData} />

      <h3 style={{color:"#fff", marginTop:20}}>Service Request Time</h3>
      <Scatter data={staticServiceData} />
    </div>
  );
}
