import React from 'react'
import SideBar from '../components/SideBar'

import {Outlet} from  "react-router-dom"


const AuthLayout = () => {
  return (
    <>
     <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">

          <SideBar/>

          < div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
            <div className="w-100" style={{ maxWidth: "420px" }}>
           
            <Outlet />
          </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default AuthLayout






// import React from "react";

// const AuthLayout = ({ children, title, subtitle }) => {
//   return (
//     <div className="container-fluid min-vh-100">
//       <div className="row min-vh-100">

//         {/* LEFT SIDE */}
//         <div
//           className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center text-white"
//           style={{
//             background: "linear-gradient(135deg, #f97316, #f59e0b)",
//           }}
//         >
//           <div className="text-center px-4">
//             <h1 className="fw-bold display-5 mb-4">Welcome Back</h1>
//             <p className="fs-5">
//               Discover premium products curated just for you.
//               <br />
//               Sign in to explore our collection.
//             </p>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
//           <div className="w-100" style={{ maxWidth: "420px" }}>
//             <h2 className="fw-bold mb-2">{title}</h2>
//             <p className="text-muted mb-4">{subtitle}</p>

//             {children}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthLayout;
