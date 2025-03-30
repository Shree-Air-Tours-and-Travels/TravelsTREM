import React from "react";
import Routers from "../../pages/Routers/Routers";
import Header from "../../pages/ProfilePage/header";
import Footer from "../../pages/ProfilePage/footer";
const Layout = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <Routers user={user} />
      <Footer user={user} />
    </>
  );
};

export default Layout;
