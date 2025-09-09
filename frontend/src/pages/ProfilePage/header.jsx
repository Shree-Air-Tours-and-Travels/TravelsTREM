// src/pages/ProfilePage/header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice.js";
import "../../styles/components/header.scss";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth || {});

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth");
    };

    return (
        <header className="ui-header">
            <div className="ui-header__container">
                <div className="ui-header__logo">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        TravelsTREM
                    </NavLink>
                </div>

                <nav className="ui-header__nav">
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
                </nav>
            </div>
        </header>
    );
};

export default Header;
