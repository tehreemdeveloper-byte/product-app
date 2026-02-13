import React from 'react'

const SideBar = () => {
  return (
   
<>

        {/* LEFT SIDE */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center text-white"
             style={{
               background: "linear-gradient(135deg, #f97316, #f59e0b)"
             }}>
          <div className="text-center px-4">
            <h1 className="fw-bold display-5 mb-4">Welcome Back</h1>
            <p className="fs-5">
              Discover premium products curated just for you.
              <br />
              Sign in to explore our collection.
            </p>
          </div>
        </div>
 

</>
  )
}

export default SideBar