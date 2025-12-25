import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EfficiencyChart({ data }) {
  // ✅ Memoized chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [], datasets: [] }; // safe empty chart
    }

    return {
      labels: data.map(item => `Emp ${item.employee_id}`),
      datasets: [
        {
          label: "Efficiency Score",
          data: data.map(item => Number(item.efficiency_score)),
          
          
          
          
          
          
          
          backgroundColor: data.map(item =>
            item.anomaly === "anomaly"
              ? "rgba(198, 40, 40, 0.6)"
              : "rgba(25, 118, 210, 0.6)"
          ),
          hoverBackgroundColor: data.map(item =>
            item.anomaly === "anomaly"
              ? "rgba(198, 40, 40, 0.9)"
              : "rgba(25, 118, 210, 0.9)"
          ),



          borderRadius: 4,
          barThickness: 30,
        },
      ],
    };
  }, [data]);

  // ✅ Memoized options
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Employee Efficiency Overview", font: { size: 20 } },
      tooltip: { callbacks: { label: (tooltipItem) => `Score: ${tooltipItem.raw}` } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Efficiency Score" } },
      x: { title: { display: true, text: "Employee" } },
    },
  }), []);

  // ✅ Conditional render inside JSX
  if (!Array.isArray(data) || data.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading performance data...</p>;
  }

  return (
    <div style={{
      height: "450px",
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <Bar key={JSON.stringify(chartData.labels)} data={chartData} options={options} />
    </div>
  );
}

export default EfficiencyChart;
