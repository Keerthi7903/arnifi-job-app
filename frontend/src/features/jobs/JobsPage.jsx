import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, applyToJob, fetchApplications } from "./jobsSlice";

export default function JobsPage() {
  const dispatch = useDispatch();
  const { list, loading, appliedIds } = useSelector((s) => s.jobs);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplications());
  }, [dispatch]);

  const locations = [...new Set(list.map((j) => j.location))];
  const types = [...new Set(list.map((j) => j.type))];

  const filtered = list.filter((j) => {
    const matchSearch = j.company.toLowerCase().includes(search.toLowerCase());
    const matchLoc = locationFilter ? j.location === locationFilter : true;
    const matchType = typeFilter ? j.type === typeFilter : true;
    return matchSearch && matchLoc && matchType;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2>Browse Jobs</h2>
        <p>{filtered.length} opportunities available</p>
      </div>

      <div className="filters">
        <input className="search-input" placeholder="Search by company..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">All Locations</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        {(search || locationFilter || typeFilter) && (
          <button className="btn-clear" onClick={() => { setSearch(""); setLocationFilter(""); setTypeFilter(""); }}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <div className="jobs-grid">
          {filtered.map((job) => (
            <div key={job.id} className="job-card">
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
              <button
                className={`btn-apply ${appliedIds.includes(job.id) ? "applied" : ""}`}
                onClick={() => dispatch(applyToJob(job.id))}
                disabled={appliedIds.includes(job.id)}
              >
                {appliedIds.includes(job.id) ? "✓ Applied" : "Apply Now"}
              </button>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">No jobs match your search.</div>}
        </div>
      )}
    </div>
  );
}