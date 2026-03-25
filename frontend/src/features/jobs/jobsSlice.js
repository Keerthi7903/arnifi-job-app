import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;
const headers = (token) => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` });

export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  const res = await fetch(`${API}/api/jobs`, { headers: headers(token) });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return json;
});

export const createJob = createAsyncThunk("jobs/create", async (data, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  const res = await fetch(`${API}/api/jobs`, { method: "POST", headers: headers(token), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return json;
});

export const updateJob = createAsyncThunk("jobs/update", async ({ id, data }, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  const res = await fetch(`${API}/api/jobs/${id}`, { method: "PUT", headers: headers(token), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return json;
});

export const deleteJob = createAsyncThunk("jobs/delete", async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  const res = await fetch(`${API}/api/jobs/${id}`, { method: "DELETE", headers: headers(token) });
  if (!res.ok) { const j = await res.json(); return rejectWithValue(j.message); }
  return id;
});

export const applyToJob = createAsyncThunk("jobs/apply", async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  const res = await fetch(`${API}/api/jobs/${id}/apply`, { method: "POST", headers: headers(token) });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return id;
});

export const fetchApplications = createAsyncThunk("jobs/applications", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  const res = await fetch(`${API}/api/applications`, { headers: headers(token) });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return json;
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState: { list: [], applications: [], loading: false, error: null, appliedIds: [] },
  reducers: { clearJobError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (s) => { s.loading = true; })
      .addCase(fetchJobs.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createJob.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(updateJob.fulfilled, (s, a) => {
        const i = s.list.findIndex((j) => j.id === a.payload.id);
        if (i !== -1) s.list[i] = a.payload;
      })
      .addCase(deleteJob.fulfilled, (s, a) => { s.list = s.list.filter((j) => j.id !== a.payload); })
      .addCase(applyToJob.fulfilled, (s, a) => { s.appliedIds.push(a.payload); })
      .addCase(fetchApplications.fulfilled, (s, a) => {
        s.applications = a.payload;
        s.appliedIds = a.payload.map((j) => j.id);
      });
  },
});

export const { clearJobError } = jobsSlice.actions;
export default jobsSlice.reducer;