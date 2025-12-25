import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {user && <Link to="/">Dashboard</Link>}
      {user && <Link to="/add-performance">Add Performance</Link>}
      {user && <Link to="/predict-efficiency">Predict Efficiency</Link>}
      {user ? (
        <button onClick={logout} style={{ marginLeft: "20px" }}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
