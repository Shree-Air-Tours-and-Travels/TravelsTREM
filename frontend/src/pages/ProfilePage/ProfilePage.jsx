import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../redux/userSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  console.log(user, loading);
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div>
    <h1>Welcome, {user.name}!</h1>
    <p>Email: {user.email}</p>
    <button onClick={() => navigate("/")}>Logout</button>
  </div>
  );
};

export default ProfilePage;
