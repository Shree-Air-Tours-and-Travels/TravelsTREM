// src/components/AuthWrapper.jsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initAuth, logout as logoutAction } from "../../../redux/authSlice.js";
import Header from "../../ProfilePage/header.jsx";
import Routers from "../../Routers/Routers.js";



/**
 * AuthWrapper
 * - Always render Header so user can click Login/Home immediately.
 * - Mount Routers always; ProtectedRoute handles redirects.
 * - While auth is initializing, show a lightweight loading area for main content
 *   so the header/footer remain visible and active.
 */
const AuthWrapper = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth || {});
    const initCalled = useRef(false);

    useEffect(() => {
        // ensure initAuth only called once (defensive)
        if (!initCalled.current) {
            initCalled.current = true;
            dispatch(initAuth()).catch((err) => {
                // we still handle errors gracefully — show it in console for debugging
                console.error("initAuth error:", err);
            });
        }
    }, [dispatch]);

    useEffect(() => {
        const handler = () => dispatch(logoutAction());
        window.addEventListener("app:logout", handler);
        return () => window.removeEventListener("app:logout", handler);
    }, [dispatch]);

    return (
        <div>
            <Header />
            <main style={{ minHeight: "calc(100vh - 200px)" }}>
                {loading ? (
                    <div style={{ height: "60vh", display: "grid", placeItems: "center" }}>
                        <div>
                            <div style={{ fontSize: 16, marginBottom: 8 }}>Initializing session…</div>
                            <div style={{ color: "#666" }}>Checking authentication and user profile</div>
                        </div>
                    </div>
                ) : (
                    <Routers />


                )}
            </main>
           {/* {user && <Footer />} */}
        </div>
    );
};

export default AuthWrapper;