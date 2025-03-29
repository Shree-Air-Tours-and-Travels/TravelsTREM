// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../redux/userSlice";
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
//   MDBCheckbox,
// } from "mdb-react-ui-kit";

// const RegisterPage = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state) => state.user);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const resultAction = await dispatch(registerUser({ name, email, password }));
//     if (registerUser.fulfilled.match(resultAction)) {
//       navigate("/profile");
//     }
//   };

//   return (
//     <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
//       <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
//         <MDBTabsItem>
//           <MDBTabsLink href="/login">Login</MDBTabsLink>
//         </MDBTabsItem>
//         <MDBTabsItem>
//           <MDBTabsLink active>Register</MDBTabsLink>
//         </MDBTabsItem>
//       </MDBTabs>

//       <MDBTabsContent>
//         <MDBTabsPane show>
//           <div className="text-center mb-3">
//             <p>Sign up with:</p>
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

//           <form onSubmit={handleRegister}>
//             <MDBInput
//               wrapperClass="mb-4"
//               label="Name"
//               id="form1"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <MDBInput
//               wrapperClass="mb-4"
//               label="Email address"
//               id="form2"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <MDBInput
//               wrapperClass="mb-4"
//               label="Password"
//               id="form3"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <div className="d-flex justify-content-center mb-4">
//               <MDBCheckbox name="terms" id="termsCheck" label="I agree to the terms" required />
//             </div>

//             {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

//             <MDBBtn type="submit" className="mb-4 w-100" disabled={loading}>
//               {loading ? "Registering..." : "Sign up"}
//             </MDBBtn>
//           </form>
//         </MDBTabsPane>
//       </MDBTabsContent>
//     </MDBContainer>
//   );
// };

// export default RegisterPage;
