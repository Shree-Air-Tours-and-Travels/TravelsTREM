import React from "react";
import { useSelector } from "react-redux";
import Layout from "./components/layout/layout";


const App = () => {
  const { user } = useSelector((state) => state.user);
  return <Layout user={user} />;
};

export default App;
