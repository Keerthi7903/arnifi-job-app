import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createJob, updateJob } from "../jobs/jobsSlice";

export default function JobForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editJob = location.state?.job || null;
  const { loading, error } = useSelector((s) => s.jobs);

  const [form, setForm] = useState({
    company: editJob?.company || "",
    position: editJob?.position || "",
    type: editJob?.type || "Full Time",
    location: editJob?.location || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editJob) {
      await dispatch(updateJob({ id: editJob.id, data: form }));
    } else {
      await dispatch(createJob(form));
    }
    navigate("/admin");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>{editJob ? "Edit Job" : "Post New Job"}</h2>
      </div>
      <div className="form-card">
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="job-form">
          <div className="field">
            <label>Company Name</label>
            <input type="text" placeholder="e.g. Arnifi Inc." value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          </div>
          <div className="field">
            <label>Position</label>
            <input type="text" placeholder="e.g. Frontend Developer" value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })} required />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Full Time</option>
              <option>Part Time</option>
            </select>
          </div>
          <div className="field">
            <label>Location</label>
            <input type="text" placeholder="e.g. Remote, Dubai, London" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/admin")}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : editJob ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}