// src/pages/AuthPage/Auth.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api.js"; // axios instance
import { initAuth } from "../../redux/authSlice.js";
import { useNavigate, useLocation } from "react-router-dom";

import "./AuthPage.scss";
import Icon from "../../icons/Icon.jsx";
import ForgotPasswordModal from "./authModals/ForgotPasswordModal.jsx";
import ResetPasswordModal from "./authModals/ResetPasswordModal.jsx";

// --------------------------------------------------------------
// NOTE: No local CONFIG used — everything comes from server cfg.
// If server cfg cannot be fetched, we show an error and disable the form.
// --------------------------------------------------------------

const extractToken = (res) =>
    res?.data?.token || res?.token || res?.data?.data?.token || res?.data?.user?.token;

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // forgot/reset modal states
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    // remember me
    const [remember, setRemember] = useState(false);

    // --- cfg comes entirely from server ---
    const [cfg, setCfg] = useState(null); // null until loaded
    const [cfgLoading, setCfgLoading] = useState(true);
    const [cfgError, setCfgError] = useState(null);

    // central form state - initialize after cfg loads (see effect below)
    const [form, setForm] = useState(null);

    // 1) Fetch remote config on mount. endpoint: /api/auth/config (adjust if needed)
    useEffect(() => {
        let canceled = false;
        const fetchCfg = async () => {
            setCfgLoading(true);
            setCfgError(null);
            try {
                const res = await api.get("/auth/config"); // resolves to /api/auth/config
                const remote = res?.data?.componentData?.structure;
                if (!remote) {
                    throw new Error("Invalid config format from server");
                }

                // normalize remote into the shape we expect
                const normalized = {
                    defaultRole: remote.defaultRole || "member",
                    roles: Array.isArray(remote.roles) ? remote.roles : [],
                    socialProviders: Array.isArray(remote.socialProviders) ? remote.socialProviders : [],
                    strings: { ...(remote.strings || {}) },
                    storageKeys: {
                        token: (remote.storageKeys && remote.storageKeys.token) || "token",
                        rememberEmail: (remote.storageKeys && (remote.storageKeys.rememberMe || remote.storageKeys.rememberEmail)) || "remember_email",
                    },
                };

                if (!canceled) {
                    setCfg(normalized);
                    setCfgError(null);
                }
            } catch (err) {
                console.error("Failed to load auth config:", err);
                if (!canceled) {
                    setCfgError(err?.response?.data?.message || err.message || "Failed to load auth config");
                    setCfg(null);
                }
            } finally {
                if (!canceled) setCfgLoading(false);
            }
        };

        fetchCfg();
        return () => {
            canceled = true;
        };
    }, []);

    // 2) Initialize form state once cfg is available.
    //    Until cfg is ready, form stays null.
    useEffect(() => {
        if (!cfg) return;

        const remembered = localStorage.getItem(cfg.storageKeys.rememberEmail);
        if (remembered) setRemember(true);

        setForm({
            name: "",
            email: remembered || "",
            password: "",
            confirmPassword: "",
            role: cfg.defaultRole || (cfg.roles[0] && cfg.roles[0].value) || "member",
            adminSecret: "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cfg]);

    // helper: safe update for form when form exists
    const update = (key) => (e) => {
        if (!form) return;
        const value = e?.target?.value ?? e;
        setForm((s) => ({ ...s, [key]: value }));
    };

    const handleOAuth = (providerId) => {
        window.location.href = `/auth/${providerId}`;
    };

    const handleRememberToggle = (e) => {
        const checked = e.target.checked;
        setRemember(checked);
        if (!checked && cfg) {
            localStorage.removeItem(cfg.storageKeys.rememberEmail);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!cfg || !form) {
            setError("Configuration is still loading. Please wait.");
            return;
        }

        if (activeTab === "login") {
            if (!form.email || !form.password) {
                setError(cfg.strings?.missingLoginFields || "Email and password are required.");
                return;
            }

            setLoading(true);
            try {
                const res = await api.post(
                    "/auth/login",
                    { email: form.email.trim(), password: form.password },
                    { headers: { "Content-Type": "application/json" } }
                );

                const token = extractToken(res);
                if (!token) {
                    console.error("[login] full response:", res);
                    throw new Error("No token from server (see console).");
                }

                localStorage.setItem(cfg.storageKeys.token, token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                if (remember) {
                    localStorage.setItem(cfg.storageKeys.rememberEmail, form.email.trim());
                } else {
                    localStorage.removeItem(cfg.storageKeys.rememberEmail);
                }

                await dispatch(initAuth()).unwrap();

                const dest = location.state?.from?.pathname || "/";
                navigate(dest, { replace: true });
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
                setError(cfg.strings?.missingRegisterFields || "Please fill name, email and password.");
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError(cfg.strings?.passwordsMismatch || "Passwords do not match.");
                return;
            }

            if (form.role === "admin" && !form.adminSecret) {
                setError(cfg.strings?.needAdminSecret || "Admin secret required to register as admin.");
                return;
            }

            setLoading(true);
            try {
                const payload = {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    role: form.role,
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

                localStorage.setItem(cfg.storageKeys.token, token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                await dispatch(initAuth()).unwrap();
                navigate("/", { replace: true });
            } catch (err) {
                console.error("[Auth] register error:", err);
                const msg = err?.response?.data?.message || err.message || "Registration failed";
                setError(msg);
            } finally {
                setLoading(false);
            }
        }
    };

    // If config still loading, show a centered loader (you can render form but disabled — up to you)
    if (cfgLoading || form === null) {
        return (
            <div className="auth-page" aria-live="polite" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
                <div>
                    <div style={{ textAlign: "center", marginBottom: 8 }}>Loading authentication configuration…</div>
                    {cfgError && (
                        <div style={{ color: "#7a2f00", background: "#fff4e5", padding: 10, borderRadius: 6 }}>
                            {`Failed to load config: ${cfgError}. Please try again later.`}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // normal render (cfg & form are available)
    return (
        <div className="auth-page">
            {cfgError && (
                <div className="auth__cfg-error" role="status" style={{ marginBottom: 12 }}>
                    <strong>Config error:</strong> {cfgError}. Using last known config (if any).
                </div>
            )}

            <div className="auth__tabs">
                <button
                    className={`auth__tab ${activeTab === "login" ? "auth__tab--active" : ""}`}
                    onClick={() => {
                        setActiveTab("login");
                        setError(null);
                    }}
                >
                    {cfg.strings?.loginButton || "Log In"}
                </button>
                <button
                    className={`auth__tab ${activeTab === "register" ? "auth__tab--active" : ""}`}
                    onClick={() => {
                        setActiveTab("register");
                        setError(null);
                    }}
                >
                    {cfg.strings?.registerButton || "Register"}
                </button>
            </div>

            <div className="auth">
                <p className="auth__text">{cfg.strings?.signInWith || "Sign in with:"}</p>

                <div className="auth__socials">
                    {cfg.socialProviders.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            className="auth__social-btn"
                            onClick={() => handleOAuth(p.id)}
                            aria-label={`Sign in with ${p.label}`}
                        >
                            <Icon name={p.id} size={20} title={p.label} />
                        </button>
                    ))}
                </div>

                <p className="auth__or">{cfg.strings?.or || "or:"}</p>

                <form className="auth__form" onSubmit={handleSubmit}>
                    {activeTab === "register" && (
                        <input
                            type="text"
                            className="auth__input"
                            placeholder={cfg.strings?.placeholder?.name || "Name"}
                            value={form.name}
                            onChange={update("name")}
                            required
                        />
                    )}

                    <input
                        type="email"
                        className="auth__input"
                        placeholder={cfg.strings?.placeholder?.email || "Email or username"}
                        value={form.email}
                        onChange={update("email")}
                        required
                    />

                    <div className="auth__password-row">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="auth__input auth__input--password"
                            placeholder={cfg.strings?.placeholder?.password || "Password"}
                            value={form.password}
                            onChange={update("password")}
                            required
                        />
                        <button
                            type="button"
                            className="auth__eye-btn"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <Icon name={showPassword ? "eyeSlash" : "eye"} size={16} title={showPassword ? "Hide password" : "Show password"} />
                        </button>
                    </div>

                    {activeTab === "register" && (
                        <>
                            <div className="auth__password-row">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="auth__input auth__input--password"
                                    placeholder={cfg.strings?.placeholder?.confirmPassword || "Confirm Password"}
                                    value={form.confirmPassword}
                                    onChange={update("confirmPassword")}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth__eye-btn"
                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    <Icon name={showConfirmPassword ? "eyeSlash" : "eye"} size={16} title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} />
                                </button>
                            </div>

                            <select className="auth__input" value={form.role} onChange={update("role")} aria-label="Role">
                                {cfg.roles.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>

                            {form.role === "admin" && (
                                <input
                                    type="password"
                                    className="auth__input"
                                    placeholder={cfg.strings?.placeholder?.adminSecret || "Admin Secret"}
                                    value={form.adminSecret}
                                    onChange={update("adminSecret")}
                                    required
                                />
                            )}
                        </>
                    )}

                    <div className="auth__options">
                        <label className="auth__checkbox">
                            <input type="checkbox" checked={remember} onChange={handleRememberToggle} />
                            {cfg.strings?.rememberEmail || "Remember me"}
                        </label>

                        <button type="button" className="auth__forgot" onClick={handleForgotPassword}>
                            {cfg.strings?.forgotPassword || "Forgot password?"}
                        </button>
                    </div>

                    {error && (
                        <p className="auth__error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="auth__button" disabled={loading}>
                        {loading ? cfg.strings?.processing || "Processing..." : activeTab === "login" ? cfg.strings?.loginButton || "Log In" : cfg.strings?.registerButton || "Register"}
                    </button>
                </form>

                <p className="auth__register">
                    {activeTab === "login" ? (
                        <>
                            {cfg.strings?.notAMember || "Not a member?"}{" "}
                            <a style={{ cursor: "pointer" }} onClick={() => setActiveTab("register")}>
                                {cfg.strings?.signUp || "Sign up"}
                            </a>
                        </>
                    ) : (
                        <>
                            {cfg.strings?.alreadyAMember || "Already a member?"}{" "}
                            <a style={{ cursor: "pointer" }} onClick={() => setActiveTab("login")}>
                                {cfg.strings?.loginButton || "Log In"}
                            </a>
                        </>
                    )}
                </p>
            </div>

            {/* Forgot / Reset modals */}
            {showForgotModal && (
                <ForgotPasswordModal
                    open={showForgotModal}
                    initialEmail={form.email}
                    onClose={() => setShowForgotModal(false)}
                    onOtpSent={(email) => {
                        setResetEmail(email);
                        setShowForgotModal(false);
                        setShowResetModal(true);
                    }}
                    api={api}
                />
            )}

            {showResetModal && (
                <ResetPasswordModal
                    open={showResetModal}
                    email={resetEmail}
                    onClose={() => setShowResetModal(false)}
                    api={api}
                    onResetSuccess={async (data) => {
                        const token = data?.token;
                        if (token) {
                            localStorage.setItem(cfg.storageKeys.token, token);
                            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                            try {
                                await dispatch(initAuth()).unwrap();
                            } catch (err) {
                                // ignore
                            }
                            setShowResetModal(false);
                            navigate("/", { replace: true });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Auth;
