// import React from 'react';
// import "./App.css";
// import {BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
// import { Link, useNavigate } from "react-router-dom";
// import Login from './Pages/Auth/Login';
// import Register from './Pages/Auth/Register';
// // App.js
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Home from './Pages/Home/Home';
// import SetAvatar from './Pages/Avatar/setAvatar';
// import Dashboard from "./Pages/Dashboard/Dashboard";

// const App = () => {

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <div>
//             <Link to="/dashboard">
//               <button className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Go to Dashboard
//               </button>
//             </Link>
//           </div>
//           <Route path="/register" element={<Register />} />
//           <Route path="/setAvatar" element={<SetAvatar />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App

import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Home from "./Pages/Home/Home";
import SetAvatar from "./Pages/Avatar/setAvatar";
import Dashboard from "./Pages/Dashboard/Dashboard";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
