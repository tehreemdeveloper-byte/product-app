import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4" style={{borderColor:"#e5e7eb"}}>
      <div className="container py-2" >

        {/* Left Logo */}
        <a className="navbar-brand fw-bold d-flex align-items-center" href="#">
          <div
            className="me-2 d-flex align-items-center justify-content-center"
            style={{
              width: "35px",
              height: "35px",
              background: "linear-gradient(135deg, #f97316, #f59e0b)",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            🛍
          </div>
          Store
        </a>

        {/* Right Profile */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="fw-semibold">Tehreem Saleem</div>
            <small className="text-muted">tehreemsaleem001@gmail.com</small>
          </div>

          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
          >
            👤
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
