
import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {

  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
        <div className="container py-2 d-flex justify-content-between align-items-center">

          {/* ================= Left Logo ================= */}
          <div className="d-flex align-items-center">

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

            <Link
              to="/"
              style={{ textDecoration: "none", color: "black" }}
              className="fw-bold fs-5"
            >
              Store
            </Link>

          </div>

          {/* ================= Right Section ================= */}
          <div className="d-flex align-items-center gap-4">

            {/* 🛒 Cart Icon */}
            <div className="position-relative">

              <div
                data-bs-toggle="offcanvas"
                data-bs-target="#cartSidebar"
                aria-controls="cartSidebar"
                className="d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "45px",
                  height: "45px",
                  background: "linear-gradient(135deg, #f97316, #f59e0b)",
                  borderRadius: "12px",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                <FaShoppingCart size={18} />
              </div>

              {/* Badge */}
              <span
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  top: "-6px",
                  right: "-6px",
                  width: "20px",
                  height: "20px",
                  background: "#dc2626",
                  color: "white",
                  fontSize: "12px",
                  borderRadius: "50%",
                  fontWeight: "bold"
                }}
              >
                3
              </span>

            </div>

            {/* 👤 User Info */}
            <div className="text-end">
              <div className="fw-semibold">
                {userData?.name || "Guest"}
              </div>
              <small className="text-muted">
                {userData?.email || ""}
              </small>
            </div>

            {/* Avatar */}
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              👤
            </div>

          </div>

        </div>
      </nav>

      {/* ================= Sidebar ================= */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartSidebar"
      >
        <div className="offcanvas-header">
          <h5 className="fw-bold">🛒 Your Cart</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">

          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h6 className="mb-1">Premium Shoes</h6>
              <p className="mb-1 text-muted small">Quantity: 1</p>
              <p className="fw-bold text-warning">$120</p>
            </div>
          </div>

          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h6 className="mb-1">Smart Watch</h6>
              <p className="mb-1 text-muted small">Quantity: 2</p>
              <p className="fw-bold text-warning">$250</p>
            </div>
          </div>

          <div className="card mb-3 shadow-sm">
            <div className="card-body">
              <h6 className="mb-1">Leather Bag</h6>
              <p className="mb-1 text-muted small">Quantity: 1</p>
              <p className="fw-bold text-warning">$180</p>
            </div>
          </div>

          <button className="btn btn-warning w-100 mt-3">
            Proceed to Checkout
          </button>

        </div>
      </div>
    </>
  );
};

export default Navbar;





