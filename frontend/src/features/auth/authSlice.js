import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("arnifi_user")); } catch { return null; }
};

export const signup = createAsyncThunk("auth/signup", async (data, { rejectWithValue }) => {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return json;
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return rejectWithValue(json.message);
  return json;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem("arnifi_token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null; state.token = null;
      localStorage.removeItem("arnifi_token");
      localStorage.removeItem("arnifi_user");
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("arnifi_token", action.payload.token);
      localStorage.setItem("arnifi_user", JSON.stringify(action.payload.user));
    };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(signup.pending, handlePending).addCase(signup.fulfilled, handleFulfilled).addCase(signup.rejected, handleRejected)
      .addCase(login.pending, handlePending).addCase(login.fulfilled, handleFulfilled).addCase(login.rejected, handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;