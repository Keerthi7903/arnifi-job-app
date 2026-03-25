import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs, deleteJob } from "../jobs/jobsSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { list, loading } = useSelector((s) => s.jobs);

  useEffect(() => { dispatch(fetchJobs()); }, [dispatch]);

  const myJobs = list.filter((j) => j.admin_id === user?.id);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>{myJobs.length} jobs posted</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/admin/new")}>+ Post New Job</button>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Type</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>{job.position}</td>
                  <td><span className={`tag tag-type ${job.type === "Full Time" ? "full" : "part"}`}>{job.type}</span></td>
                  <td>{job.location}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => navigate("/admin/new", { state: { job } })}>Edit</button>
                    <button className="btn-delete" onClick={() => dispatch(deleteJob(job.id))}>Delete</button>
                  </td>
                </tr>
              ))}
              {myJobs.length === 0 && (
                <tr><td colSpan="5" className="empty">No jobs posted yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}