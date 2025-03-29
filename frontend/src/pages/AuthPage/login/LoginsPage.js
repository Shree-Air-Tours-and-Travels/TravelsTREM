// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../redux/userSlice";
// import { useNavigate } from "react-router-dom";
// import {
//   MDBContainer,
//   MDBTabs,
//   MDBTabsItem,
//   MDBTabsLink,
//   MDBTabsContent,
//   MDBTabsPane,
//   MDBBtn,
//   MDBIcon,
//   MDBInput,
//   MDBCheckbox
// } from "mdb-react-ui-kit";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state) => state.user);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const resultAction = await dispatch(loginUser({ email, password }));
//     if (loginUser.fulfilled.match(resultAction)) {
//       navigate("/profile");
//     }
//   };

//   const [justifyActive, setJustifyActive] = useState("tab1");

//   const handleJustifyClick = (value) => {
//     if (value === justifyActive) return;
//     setJustifyActive(value);
//   };

//   return (
//     <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
//       <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
//         <MDBTabsItem>
//           <MDBTabsLink onClick={() => handleJustifyClick("tab1")} active={justifyActive === "tab1"}>
//             Login
//           </MDBTabsLink>
//         </MDBTabsItem>
//         <MDBTabsItem>
//           <MDBTabsLink onClick={() => handleJustifyClick("tab2")} active={justifyActive === "tab2"}>
//             Register
//           </MDBTabsLink>
//         </MDBTabsItem>
//       </MDBTabs>

//       <MDBTabsContent>
//         {/* 🔹 Login Form */}
//         <MDBTabsPane show={justifyActive === "tab1"}>
//           <div className="text-center mb-3">
//             <p>Sign in with:</p>
//             <div className="d-flex justify-content-between mx-auto" style={{ width: "40%" }}>
//               <MDBBtn tag="a" color="none" className="m-1" style={{ color: "#1266f1" }}>
//                 <MDBIcon fab icon="facebook-f" size="sm" />
//               </MDBBtn>
//               <MDBBtn tag="a" color="none" className="m-1" style={{ color: "#1266f1" }}>
//                 <MDBIcon fab icon="twitter" size="sm" />
//               </MDBBtn>
//               <MDBBtn tag="a" color="none" className="m-1" style={{ color: "#1266f1" }}>
//                 <MDBIcon fab icon="google" size="sm" />
//               </MDBBtn>
//               <MDBBtn tag="a" color="none" className="m-1" style={{ color: "#1266f1" }}>
//                 <MDBIcon fab icon="github" size="sm" />
//               </MDBBtn>
//             </div>
//             <p className="text-center mt-3">or:</p>
//           </div>

//           <form onSubmit={handleLogin}>
//             <MDBInput
//               wrapperClass="mb-4"
//               label="Email address"
//               id="form1"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <MDBInput
//               wrapperClass="mb-4"
//               label="Password"
//               id="form2"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <div className="d-flex justify-content-between mx-4 mb-4">
//               <MDBCheckbox name="flexCheck" value="" id="flexCheckDefault" label="Remember me" />
//               <a href="#!">Forgot password?</a>
//             </div>

//             {/* 🔹 Show error if login fails */}
//             {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

//             <MDBBtn type="submit" className="mb-4 w-100" disabled={loading}>
//               {loading ? "Logging in..." : "Sign in"}
//             </MDBBtn>
//           </form>

//           <p className="text-center">
//             Not a member? <a href="#!" onClick={() => setJustifyActive("tab2")}>Register</a>
//           </p>
//         </MDBTabsPane>
//       </MDBTabsContent>
//     </MDBContainer>
//   );
// };

// export default LoginPage;
