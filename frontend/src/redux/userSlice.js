import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register User
export const registerUser = createAsyncThunk("user/register", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", userData, { withCredentials: true });

    if (response.status === 201) {
      dispatch(getProfile()); // ✅ Fetch profile only after successful registration
      return response.data;
    } else {
      return rejectWithValue("Registration failed");
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// Login User
export const loginUser = createAsyncThunk("user/login", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", userData, { withCredentials: true });
    dispatch(getProfile()); // ✅ Fetch fresh user data after login
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Login failed");
  }
});

// Get Profile
export const getProfile = createAsyncThunk("user/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/profile", { withCredentials: true });
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Failed to load profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // ✅ Ensure new user is stored
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
