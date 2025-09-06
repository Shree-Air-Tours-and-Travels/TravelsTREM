import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
// import api from "api";
import api from "../utils/api";

// Register User
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.status === 201) {
        dispatch(getProfile()); // Fetch profile only after successful registration
        // Save user in localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        return response.data;
      } else {
        return rejectWithValue("Registration failed");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post("/auth/login", userData);
      dispatch(getProfile()); // Fetch fresh user data after login
      // Save user in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Get Profile
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

// Initial state: load user from localStorage if present
const initialState = {
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("userInfo"); // Remove persisted user
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
        state.user = action.payload;
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
        // Update localStorage in case profile changed
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {logout} = userSlice.actions;
export default userSlice.reducer;
