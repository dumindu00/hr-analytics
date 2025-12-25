import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true, // enable cookies if needed
});

// Set Authorization header for all requests
export const setToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

const API = {
  setToken,

  // Monthly Performance
  getMonthlyPerformance: async (month) =>
    instance.get("/monthly-performance/", { params: { month } }),

  addMonthlyPerformance: async (data) =>
    instance.post("/monthly-performance", data), // no trailing slash

  deleteMonthlyPerformance: async (id) =>
    instance.delete(`/monthly-performance/${id}`),

  // Employee Trend & Efficiency
  getEmployeeTrend: async (employeeId) =>
    instance.get(`/monthly-performance/trend/${employeeId}`),

  predictEfficiency: async (employee_id) =>
    instance.post(`/predict-efficiency/${employee_id}`),

  predictAnomaly: async (data) => instance.post(`/predict-anomaly/`, data),

  // Auth
  login: async (data) => instance.post("/login", data),
  signup: async (data) => instance.post("/signup", data),
};

export default API;
