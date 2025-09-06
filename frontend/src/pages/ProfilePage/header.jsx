import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import "../../styles/components/header.scss";
// import { getProfile } from "../../redux/userSlice";

const Header = ({ user }) => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   dispatch(getProfile());
  // }, [dispatch]);

  const handleLogout = () => {
    navigate("/auth");
  };

  return (
    <header className="ui-header">
      <div className="ui-header__container">
        <div className="ui-header__logo">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            TravelsTREM
          </NavLink>
        </div>
        <nav className="ui-header__nav">
          <ul className="ui-header__menu ui-header__menu--start">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tours"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Tour
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About
              </NavLink>
            </li>
          </ul>
          <ul className="ui-header__menu ui-header__menu--end">
            {!user ? (
              <li>
                <NavLink
                  to="/auth"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Login
                </NavLink>
              </li>
            ) : (
              <div className="ui-header--end__user-container">
                <li>
                  <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
                    Logout
                  </button>
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