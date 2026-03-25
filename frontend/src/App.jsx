import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import JobsPage from "./features/jobs/JobsPage";
import AppliedJobs from "./features/jobs/AppliedJobs";
import AdminDashboard from "./features/admin/AdminDashboard";
import JobForm from "./features/admin/JobForm";

export default function App() {
  const { user } = useSelector((s) => s.auth);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/jobs") : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<ProtectedRoute role="user"><JobsPage /></ProtectedRoute>} />
        <Route path="/applied" element={<ProtectedRoute role="user"><AppliedJobs /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/new" element={<ProtectedRoute role="admin"><JobForm /></ProtectedRoute>} />
      </Routes>
    </>
  );
}