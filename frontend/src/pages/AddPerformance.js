import { useState } from 'react'
import API from "../api";

function AddPerformance() {

  const [formData, setFormData] = useState({

    employee_id: "",
    month: "",
    hours_worked: "",
    tasks_completed: "",
    avg_task_difficulty: "",
    break_hours: "",
    efficiency_score: "",

  })

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      await API.addMonthlyPerformance(formData);
      alert("Data added successfully!")
  }




  return (
    <div>
      <h1>Add Monthly Performance</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label>{key.replace("_", " ")}: </label>
              <input
                      type={["hours_worked","tasks_completed","avg_task_difficulty","break_hours","efficiency_score"].includes(key) ? "number" : "text"}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                    />
          </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddPerformance