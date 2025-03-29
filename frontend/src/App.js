import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage/Auth";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

const App = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <AuthPage />} />
    </Routes>
  );
};

export default App;
