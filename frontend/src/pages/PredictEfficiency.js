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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PredictEfficiency() {
  const [employeeId, setEmployeeId] = useState("");
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  // Fetch historical trend whenever employeeId changes
  useEffect(() => {
    if (!employeeId) return;

    const fetchHistory = async () => {
      try {
        const res = await API.getEmployeeTrend(Number(employeeId));
        setHistory(res.data);
        setPrediction(null); // reset previous prediction
      } catch (err) {
        console.error("Error fetching trend:", err);
      }
    };

    fetchHistory();
  }, [employeeId]);

  // Predict next month
  const handlePredict = async () => {
    if (!employeeId) return;

    try {
      const res = await API.predictEfficiency(Number(employeeId));
      setPrediction(res.data);
    } catch (err) {
      console.error("Error predicting efficiency:", err);
    }
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!history.length && !prediction) return { labels: [], datasets: [] };

    const labels = history.map(item => `Month ${item.month}`);
    const efficiencyData = history.map(item => item.efficiency_score);

    // Add predicted point
    if (prediction) {
      labels.push(`Month ${prediction.next_month}`);
      efficiencyData.push(prediction.predicted_efficiency);
    }

    return {
      labels,
      datasets: [
        {
          label: "Efficiency Score",
          data: efficiencyData,
          borderColor: "rgba(25, 118, 210, 1)",
          backgroundColor: "rgba(25, 118, 210, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: efficiencyData.map((_, idx) =>
            idx === efficiencyData.length - 1 ? 8 : 5
          ),
          pointBackgroundColor: efficiencyData.map((_, idx) =>
            idx === efficiencyData.length - 1 ? "#ff9800" : "#1976d2"
          ),
        },
      ],
    };
  }, [history, prediction]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Predict Next Month Efficiency</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Employee ID: </label>
        <input
          type="number"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
        />
        <button
          onClick={handlePredict}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
          disabled={!employeeId}
        >
          Predict
        </button>
      </div>

      {prediction && (
        <p>
          Predicted Efficiency for Month {prediction.next_month}:{" "}
          <strong>{prediction.predicted_efficiency}</strong>
        </p>
      )}

      <div style={{ height: "400px", marginTop: "20px" }}>
        <Line key={employeeId} data={chartData} />
      </div>
    </div>
  );
}

export default PredictEfficiency;
