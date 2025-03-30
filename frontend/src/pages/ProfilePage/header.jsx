import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/header.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../redux/userSlice";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  console.log(user, loading, "safsdf");
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
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
            <li style={ { display:!user ? "block" : "none" } }>   
              <NavLink
                to="/auth"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Login
              </NavLink>
            </li>
            <li style={ { display: !user ? "block" : "none" } }>     
              <NavLink
                to="/auth"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Register
              </NavLink>
              </li>  
            <li style={ { display: user ? "block" : "none" } }>
                {user?.name}
                <button onClick={() => navigate("/auth")} style={{margin:"20px"}}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
