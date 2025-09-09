// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api"; // your axios instance
import { jwtDecode } from "jwt-decode";

// Try to fetch current user using the token (server endpoint /auth/me or /me)
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/me"); // change endpoint if needed
            return res.data;
        } catch (err) {
            // If 401 or invalid token, let caller know
            const msg = err?.response?.data?.message || err.message || "Failed to fetch user";
            return rejectWithValue(msg);
        }
    }
);

/**
 * initAuth - a helper thunk that:
 * - checks localStorage for token
 * - sets Authorization header on api
 * - decodes token quickly to set tentative data
 * - calls server to validate and fetch full user profile
 */
export const initAuth = createAsyncThunk(
    "auth/init",
    async (_, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) return rejectWithValue("no-token");

        // set header immediately so fetchCurrentUser can use it
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // try to decode basic info from token (optional)
        let decoded = null;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            // invalid token -> remove it
            localStorage.removeItem("token");
            return rejectWithValue("invalid-token");
        }

        // fetch authoritative user data from server
        try {
            const res = await dispatch(fetchCurrentUser()).unwrap();
            // make sure server data includes role, email, name etc.
            return { token, fromToken: decoded, serverUser: res };
        } catch (err) {
            // invalid / expired token -> cleanup
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            return rejectWithValue(err || "fetch-user-failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: true, // start true while initAuth runs
        token: null,
        user: null,
        role: "public",
        error: null,
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
            if (action.payload) {
                api.defaults.headers.common["Authorization"] = `Bearer ${action.payload}`;
                localStorage.setItem("token", action.payload);
            } else {
                delete api.defaults.headers.common["Authorization"];
                localStorage.removeItem("token");
            }
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.role = "public";
            state.loading = false;
            state.error = null;
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        },
        setUser(state, action) {
            state.user = action.payload;
            state.role = action.payload?.role || "member";
        },
    },
    extraReducers(builder) {
        builder
            .addCase(initAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload?.token || null;
                // prefer serverUser; fallback to token decode
                state.user = action.payload?.serverUser || action.payload?.fromToken || null;
                state.role = state.user?.role || "member";
                state.error = null;
            })
            .addCase(initAuth.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.role = "public";
                state.error = action.payload || action.error?.message || "init-failed";
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.role = action.payload?.role || "member";
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.role = "public";
                state.error = action.payload || action.error?.message || "fetch-user-failed";
            });
    },
});

export const { setToken, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
