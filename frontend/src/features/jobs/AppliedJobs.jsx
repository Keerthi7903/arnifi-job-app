import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "./jobsSlice";

export default function AppliedJobs() {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((s) => s.jobs);

  useEffect(() => { dispatch(fetchApplications()); }, [dispatch]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Applied Jobs</h2>
        <p>{applications.length} applications submitted</p>
      </div>
      {loading ? <div className="loading">Loading...</div> : (
        <div className="jobs-grid">
          {applications.map((job) => (
            <div key={job.id} className="job-card applied-card">
              <div className="job-card-top">
                <div className="company-avatar">{job.company[0]}</div>
                <div>
                  <h3>{job.position}</h3>
                  <p className="company-name">{job.company}</p>
                </div>
              </div>
              <div className="job-tags">
                <span className={`tag tag-type ${job.type === "Full Time" ? "full" : "part"}`}>{job.type}</span>
                <span className="tag tag-loc">📍 {job.location}</span>
              </div>
              <div className="applied-badge">✓ Applied</div>
            </div>
          ))}
          {applications.length === 0 && <div className="empty">You haven't applied to any jobs yet.</div>}
        </div>
      )}
    </div>
  );
}