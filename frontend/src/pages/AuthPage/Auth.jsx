// src/pages/AuthPage/Auth.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api.js"; // axios instance
import { initAuth } from "../../redux/authSlice.js";
import { useNavigate, useLocation } from "react-router-dom";

import "./AuthPage.scss";
// NOTE: removed unused fetchData import

const DEFAULT_ROLE = "public";

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    // central form state (keeps same names used earlier)
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: DEFAULT_ROLE,
        adminSecret: "",
    });

    const update = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
    };

    // Robust token extractor - tolerates different response shapes
    const extractToken = (res) =>
        res?.data?.token || res?.token || res?.data?.data?.token || res?.data?.user?.token;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (activeTab === "login") {
            // validation
            if (!form.email || !form.password) {
                setError("Email and password are required.");
                return;
            }

            setLoading(true);
            try {
                // axios: post(url, data, config)
                const res = await api.post(
                    "/auth/login",
                    {
                        email: form.email.trim(),
                        password: form.password,
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const token = extractToken(res);
                if (!token) {
                    console.error("[login] full response:", res);
                    throw new Error("No token from server (see console).");
                }

                // persist token + set header
                localStorage.setItem("token", token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const dest = location.state?.from?.pathname || "/"; // fallback to home
                navigate(dest, { replace: true });

                // hydrate auth state
                await dispatch(initAuth()).unwrap();

                // navigate home
                navigate("/");
            } catch (err) {
                console.error("[Auth] login error:", err);
                const msg = err?.response?.data?.message || err.message || "Login failed";
                setError(msg);
            } finally {
                setLoading(false);
            }
        } else {
            // register flow
            if (!form.name || !form.email || !form.password) {
                setError("Please fill name, email and password.");
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            // If admin requested, require adminSecret
            if (form.role === "admin" && !form.adminSecret) {
                setError("Admin secret required to register as admin.");
                return;
            }

            setLoading(true);
            try {
                const payload = {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    role: form.role,
                    // only include adminSecret when role === admin
                    ...(form.role === "admin" ? { adminSecret: form.adminSecret } : {}),
                };

                const res = await api.post("/auth/register", payload, {
                    headers: { "Content-Type": "application/json" },
                });

                const token = extractToken(res);
                if (!token) {
                    console.error("[register] full response:", res);
                    throw new Error("No token from server (see console).");
                }

                localStorage.setItem("token", token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                await dispatch(initAuth()).unwrap();
                navigate("/");
            } catch (err) {
                console.error("[Auth] register error:", err);
                const msg = err?.response?.data?.message || err.message || "Registration failed";
                setError(msg);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth__tabs">
                <button
                    className={`auth__tab ${activeTab === "login" ? "auth__tab--active" : ""}`}
                    onClick={() => {
                        setActiveTab("login");
                        setError(null);
                    }}
                >
                    Login
                </button>
                <button
                    className={`auth__tab ${activeTab === "register" ? "auth__tab--active" : ""}`}
                    onClick={() => {
                        setActiveTab("register");
                        setError(null);
                    }}
                >
                    Register
                </button>
            </div>

            <div className="auth">
                <p className="auth__text">Sign in with:</p>
                <div className="auth__socials">
                    <i className="auth__icon fab fa-facebook" />
                    <i className="auth__icon fab fa-google" />
                    <i className="auth__icon fab fa-twitter" />
                    <i className="auth__icon fab fa-github" />
                </div>

                <p className="auth__or">or:</p>

                <form className="auth__form" onSubmit={handleSubmit}>
                    {activeTab === "register" && (
                        <input
                            type="text"
                            className="auth__input"
                            placeholder="Name"
                            value={form.name}
                            onChange={update("name")}
                            required
                        />
                    )}

                    <input
                        type="email"
                        className="auth__input"
                        placeholder="Email or username"
                        value={form.email}
                        onChange={update("email")}
                        required
                    />

                    <input
                        type="password"
                        className="auth__input"
                        placeholder="Password"
                        value={form.password}
                        onChange={update("password")}
                        required
                    />

                    {activeTab === "register" && (
                        <>
                            <input
                                type="password"
                                className="auth__input"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={update("confirmPassword")}
                                required
                            />

                            {/* Role selector (minimal addition) */}
                            <select className="auth__input" value={form.role} onChange={update("role")}>
                                <option value="public">Public</option>
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>

                            {form.role === "admin" && (
                                <input
                                    type="password"
                                    className="auth__input"
                                    placeholder="Admin Secret"
                                    value={form.adminSecret}
                                    onChange={update("adminSecret")}
                                    required
                                />
                            )}
                        </>
                    )}

                    <div className="auth__options">
                        <label className="auth__checkbox">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#" className="auth__forgot">
                            Forgot password?
                        </a>
                    </div>

                    {error && <p className="auth__error">{error}</p>}

                    <button type="submit" className="auth__button" disabled={loading}>
                        {loading ? "Processing..." : activeTab === "login" ? "Sign In" : "Register"}
                    </button>
                </form>

                <p className="auth__register">
                    {activeTab === "login" ? (
                        <>
                            Not a member?{" "}
                            <a style={{ cursor: "pointer" }} onClick={() => setActiveTab("register")}>
                                Register
                            </a>
                        </>
                    ) : (
                        <>
                            Already a member?{" "}
                            <a style={{ cursor: "pointer" }} onClick={() => setActiveTab("login")}>
                                Sign in
                            </a>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Auth;
