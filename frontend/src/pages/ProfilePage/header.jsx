import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice.js";
import "../../styles/components/header.scss";
import Icon from "../../icons/Icon.jsx";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth || {});
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setOpen(false);
        navigate("/auth");
    };

    // close drawer when route changes
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // keyboard: close on ESC
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <header className={`ui-header ${open ? "is-open" : ""}`} role="banner" aria-hidden={!open}>
                <div className="ui-header__container">
                    <div className="ui-header__logo">
                        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                            TravelsTREM
                        </NavLink>
                    </div>

                    <nav className="ui-header__nav" role="navigation" aria-label="Main navigation">
                        {/* Desktop menus (hidden on mobile) */}
                        <ul className="ui-header__menu ui-header__menu--start">
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                                    Home
                                </NavLink>
                            </li>

                            {user && (
                                <>
                                    <li>
                                        <NavLink to="/tours" className={({ isActive }) => (isActive ? "active" : "")}>
                                            Packages
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                                            About
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>

                        <ul className="ui-header__menu ui-header__menu--end">
                            {!user ? (
                                <li>
                                    <NavLink to="/auth" className={({ isActive }) => (isActive ? "active" : "")}>
                                        Login
                                    </NavLink>
                                </li>
                            ) : (
                                <div className="ui-header--end__user-container">
                                    <li>
                                        <button onClick={handleLogout} style={{ marginLeft: 12 }}>
                                            Logout
                                        </button>
                                    </li>
                                    <li>
                                        <span>
                                            Welcome, <strong>{user.name || user.email}</strong>
                                        </span>
                                    </li>
                                </div>
                            )}
                        </ul>

                        {/* Mobile toggle */}
                        <button
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                            className={`ui-header__toggle ${open ? "is-open" : ""}`}
                            onClick={() => setOpen((s) => !s)}
                        >
                            {open ? <Icon name="menuClose" /> : <Icon name="menuOpen" />}
                        </button>
                    </nav>
                </div>

                {/* overlay */}
                <div
                    className="ui-header__overlay"
                    onClick={() => setOpen(false)}
                    role="button"
                    aria-hidden={!open}
                    tabIndex={-1}
                />

                {/* drawer */}
                <aside className="ui-header__drawer" aria-hidden={!open} aria-label="Mobile menu">
                    <ul className="drawer-menu">
                        {user ? (
                            <>
                                <li className="user-welcome">Signed in as <strong>{user.name || user.email}</strong></li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                                    Home
                                </NavLink>
                                <li>
                                    <NavLink to="/tours">Packages</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about">About</NavLink>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/auth">Login</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/">Home</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </aside>
            </header>

            {/* spacer to prevent content jumping under fixed header */}
            <div className="ui-header__spacer" />
        </>
    );
};

export default Header;
