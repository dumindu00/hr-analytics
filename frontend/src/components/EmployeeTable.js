function EmployeeTable({ data }) {
  return (
    <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Employee ID</th>
          <th>Month</th>
          <th>Hours Worked</th>
          <th>Tasks Completed</th>
          <th>Avg Task Difficulty</th>
          <th>Break Hours</th>
          <th>Efficiency Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.employee_id}</td>
            <td>{row.month}</td>
            <td>{row.hours_worked}</td>
            <td>{row.tasks_completed}</td>
            <td>{row.avg_task_difficulty}</td>
            <td>{row.break_hours}</td>
            <td>{row.efficiency_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeTable;
