import React, { useState, useEffect } from "react";

const ForgotPasswordModal = ({ open, initialEmail = "", onClose, onOtpSent, api }) => {
    const [email, setEmail] = useState(initialEmail || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (open) {
            setEmail(initialEmail || "");
            setMessage(null);
            setLoading(false);
        }
    }, [open, initialEmail]);

    const handleSendOtp = async () => {
        if (!email) {
            setMessage("Enter a valid email.");
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const res = await api.post("/auth/forgot-password", { email });
            // show server success message if provided
            const serverMsg = res?.data?.message || "If that email exists, an OTP has been sent.";
            setMessage(serverMsg);

            // Only proceed to reset modal when server returned 200 OK
            if (res.status === 200 && onOtpSent) {
                onOtpSent(email);
            }
        } catch (err) {
            console.error("forgot password error", err);
            const msg = err?.response?.data?.message || "Failed to send OTP. Try again later.";
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
        <div
            className="modal"
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0,0,0,0.55)",
                zIndex: 9999,
            }}
        >
            <div className="modal__content" style={{ maxWidth: 420, width: "94%" }}>
                <h3>Forgot Password</h3>

                <input
                    type="email"
                    className="auth__input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {message && <p className="auth__error" style={{ color: "#aa0303ff" }}>{message}</p>}

                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                    <button className="auth__button" onClick={handleSendOtp} disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>

                    <button
                        className="auth__button"
                        onClick={onClose}
                        style={{ background: "#e2e8f0", color: "#111" }}
                        disabled={loading}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ForgotPasswordModal;