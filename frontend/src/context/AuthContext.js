import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);


  const [loading, setLoading] = useState(true);




  // On mount: restore user and token from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken && storedUser !== "undefined" && storedToken !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        // Attach token to Axios
        API.setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to restore auth state", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } 
      finally {
        setLoading(false)
      }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.login({ username, password });
      const userData = res.data.user;
      const token = res.data.token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      setUser(userData);
      setToken(token);
      API.setToken(token);

      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const signup = async (username, company_name, password) => {
    try {
      const res = await API.signup({ username, company_name, password });
      const userData = res.data.user;
      const token = res.data.token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      setUser(userData);
      setToken(token);
      API.setToken(token);

      navigate("/");
    } catch (err) {
      console.error("Signup failed", err);
      alert("Signup failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    API.setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
