import { useEffect, useState } from "react";
import EfficiencyChart from "../components/EfficiencyChart";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import API from "../api";



const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];










const Dashboard = () => {
  const [performanceData, setPerformanceData ] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);




useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await API.getMonthlyPerformance(selectedMonth);
      const data = res.data;

      const updatedData = await Promise.all(
        data.map(async (item) => {
          const anomalyRes = await API.predictAnomaly(item);
          return {
            ...item,
            anomaly: anomalyRes.data.prediction,
          };
        })
      );

      setPerformanceData(updatedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  fetchData();
}, [selectedMonth]);



   return (
    <div>
      <h2>Employee Performance Dashboard</h2>


      <label>Select Employee:</label>
        <select onChange={(e) => setSelectedEmployee(e.target.value)}>
          <option value="">-- Select --</option>
          {[...new Set(performanceData.map(p => p.employee_id))].map(id => (
            <option key={id} value={id}>Employee {id}</option>
          ))}
        </select>
        <MonthlyTrendChart employeeId={selectedEmployee} />








      <label>Select Month: </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>



        <div style={{ padding: "20px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px", marginTop: "20px" }}>
  <EfficiencyChart data={performanceData} />


      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
  <thead style={{ backgroundColor: "#1976d2", color: "#fff" }}>
    <tr>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Employee ID</th>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Month</th>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Hours Worked</th>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Tasks Completed</th>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Avg Task Difficulty</th>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Break Hours</th>
      <th style={{ padding: "8px", border: "1px solid #ddd" }}>Efficiency Score</th>
    </tr>
  </thead>
  <tbody>
  {performanceData.map((emp) => (
    <tr key={emp.id} style={{ backgroundColor: emp.anomaly === "anomaly" ? "#ffebee" : "transparent" }}>
      <td>{emp.employee_id}</td>
      <td>{emp.month}</td>
      <td>{emp.hours_worked}</td>
      <td>{emp.tasks_completed}</td>
      <td>{emp.avg_task_difficulty}</td>
      <td>{emp.break_hours}</td>
      <td>{emp.efficiency_score}</td>
      <td style={{ color: emp.anomaly === "anomaly" ? "#c62828" : "#2e7d32" }}>
                {emp.anomaly}
              </td>
      <td>
        <button
          style={{ backgroundColor: "#e53935", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
          onClick={async () => {
            if (window.confirm(`Delete record for employee ${emp.employee_id}?`)) {
              try {
                await API.deleteMonthlyPerformance(emp.id);
                setPerformanceData(performanceData.filter(r => r.id !== emp.id)); // remove from UI
              } catch (err) {
                console.error("Error deleting record", err);
              }
            }
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

</table>
</div>

    </div>
  );
}

export default Dashboard;