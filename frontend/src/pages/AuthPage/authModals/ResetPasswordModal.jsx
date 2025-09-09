import React, { useState, useEffect } from "react";


const ResetPasswordModal = ({ open, email = "", onClose, onResetSuccess, api }) => {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (open) {
            setOtp("");
            setPassword("");
            setConfirm("");
            setMessage(null);
            setLoading(false);
        }
    }, [open]);

    const handleReset = async () => {
        if (!otp || !password) {
            setMessage("OTP and new password are required.");
            return;
        }
        if (password !== confirm) {
            setMessage("Passwords do not match.");
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const res = await api.post("/auth/reset-password", { email, otp, password });

            setMessage("Password reset successful. You are now logged in.");

            // persist token if returned and notify parent
            const token = res?.data?.token;
            if (token) {
                localStorage.setItem("token", token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }

            if (onResetSuccess) onResetSuccess(res?.data);
        } catch (err) {
            console.error("reset error", err);
            const msg = err?.response?.data?.message || "Invalid or expired OTP.";
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => document.body.classList.remove("modal-open");
    }, [open]);

    if (!open) return null;
    return (
        <div className="modal" role="dialog" aria-modal="true" style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
        }}>
            <div className="modal__content">
                <h3>Reset Password</h3>
                <p style={{ fontSize: 13, color: "#444" }}>
                    OTP was sent to: <strong>{email}</strong>
                </p>

                <input
                    type="text"
                    className="auth__input"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    type="password"
                    className="auth__input"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    className="auth__input"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />

                {message && <p className="auth__error" style={{ color: "#aa0303ff" }}>{message}</p>}

                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                    <button className="auth__button" onClick={handleReset} disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    <button
                        className="auth__button"
                        onClick={onClose}
                        style={{ background: "#e2e8f0", color: "#111" }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ResetPasswordModal