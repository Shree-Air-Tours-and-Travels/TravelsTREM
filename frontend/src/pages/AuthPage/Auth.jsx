import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/AuthPage.scss";

const AuthPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = activeTab === "login" ? loginUser : registerUser;

    try {
      const result = await dispatch(action(userData)).unwrap();
      if (result) {
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth__tabs">
        <button
          className={`auth__tab ${activeTab === "login" ? "auth__tab--active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`auth__tab ${activeTab === "register" ? "auth__tab--active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>
      <div className="auth">


        <p className="auth__text">Sign in with:</p>
        <div className="auth__socials">
          <i className="auth__icon fab fa-facebook"></i>
          <i className="auth__icon fab fa-google"></i>
          <i className="auth__icon fab fa-twitter"></i>
          <i className="auth__icon fab fa-github"></i>
        </div>

        <p className="auth__or">or:</p>

        <form className="auth__form" onSubmit={handleSubmit}>
          {activeTab === "register" && (
            <input
              type="text"
              className="auth__input"
              placeholder="Name"
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          )}
          <input
            type="email"
            className="auth__input"
            placeholder="Email or username"
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="auth__input"
            placeholder="Password"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
          />

          <div className="auth__options">
            <label className="auth__checkbox">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="auth__forgot">Forgot password?</a>
          </div>

          {error && <p className="auth__error">{error}</p>}

          <button type="submit" className="auth__button" disabled={loading}>
            {loading ? "Processing..." : activeTab === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        <p className="auth__register">
          Not a member?     <a style={{ cursor: "pointer" }}
            onClick={() => setActiveTab("register")}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
