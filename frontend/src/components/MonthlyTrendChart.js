import { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import API from "../api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyTrendChart({ employeeId }) {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    if (!employeeId) return;

    const fetchTrend = async () => {
      try {
        const res = await API.getEmployeeTrend(employeeId);

        const withAnomaly = await Promise.all(
          res.data.map(async (item) => {
            const anomalyRes = await API.predictAnomaly(item);
            return {
              ...item,
              anomaly: anomalyRes.data.prediction,
            };
          })
        );
        setTrendData(withAnomaly);
      } catch (err) {
        console.error("Error fetching trend:", err);
        setTrendData([]);
      }
    };

    fetchTrend();
  }, [employeeId]);

  const chartData = useMemo(() => ({
    labels: trendData.map(item => `Month ${item.month}`),
    datasets: [
      {
        label: "Efficiency Trend",
        data: trendData.map(item => Number(item.efficiency_score)),
        borderColor: "rgba(25, 118, 210, 1)",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: trendData.map(item =>
          item.anomaly === "anomaly" ? "#c62828" : "#1976d2"
        ),
        pointHoverRadius: 8,
        pointHoverBackgroundColor: trendData.map(item =>
          item.anomaly === "anomaly" ? "#b71c1c" : "#1565c0"
        ),
      },
    ],
  }), [trendData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Monthly Efficiency Trend", font: { size: 18 } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const point = trendData[ctx.dataIndex];
            return `Score: ${ctx.raw} | Status: ${point.anomaly}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Efficiency Score" }
      },
      x: {
        title: { display: true, text: "Month" }
      }
    }
  }), [trendData]);

  if (!employeeId) {
    return <p style={{ marginTop: "20px" }}>Select an employee to view trend</p>;
  }

  if (trendData.length === 0) {
    return <p style={{ marginTop: "20px" }}>No performance data available for this employee.</p>;
  }

  return (
    <div style={{
      height: "400px",
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default MonthlyTrendChart;
