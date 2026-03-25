import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={user?.role === "admin" ? "/admin" : "/jobs"} className="nav-brand">
        Arnifi<span>Jobs</span>
      </Link>
      {user && (
        <div className="nav-links">
          {user.role === "user" && (
            <>
              <Link to="/jobs">Browse Jobs</Link>
              <Link to="/applied">Applied</Link>
            </>
          )}
          {user.role === "admin" && (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/new">Post Job</Link>
            </>
          )}
          <span className="nav-user">{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      )}
    </nav>
  );
}