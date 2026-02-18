
import React, { useEffect,useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { FaShoppingCart  } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";

import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

import dashboardService from "../services/dashboardService"
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Navbar = ({data,fetchCart}) => {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [show, setShow] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => {
  setShow(true);
  fetchCart();
}

  const handleLogout = ()=> {

    logout(); //calling function from the context api
    navigate('/', { replace: true });
  }


  // !all logic of cart list getting
//  const [data,setData] = useState([]);
  // const [error,setError] = useState(null);
  // const fetchCart = async () => {
  //   try {
  //     const res = await dashboardService.getCartProduct();
  //     console.log("Cart Response:", res);
  //     if(res.status === 200) {

  //       setData(res.data.data); 
  //       // console.log("data length",res.data.data.length);
        
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

const handleIncrement = async(product_id)=> {
  await dashboardService.addToCart(product_id)
   fetchCart();
}

const handleDecrement = async(product_id)=> {
  await dashboardService.decrementCartProduct(product_id)
   fetchCart();
  
   
}
  // !All logic of cart list getting

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4" style={{position:"sticky",top:0,overflow:"hidden",zIndex:2}}>
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
                
                onClick={handleShow}
                className="d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "45px",
                  height: "45px",
                  background: "linear-gradient(135deg, #f97316, #f59e0b)",
                  borderRadius: "12px",
                  color: "white",
                  cursor: "pointer",
                  
                }}
              >
                <FaShoppingCart size={18} />
              </div>

              {/* Badge */}

                {
                data&&data.length>0 ? 
                (
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
                {data.length}
              </span>
                
                ): 
                (null) 
                }

            </div>

            {/* 👤 User Info */}
            <div className="text-end">
              <div className="fw-semibold">
                {user?.name || "Guest"}
              </div>
              <small className="text-muted">
                {user?.email || ""}
              </small>
            </div>

            {/* Avatar */}
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              👤
            </div>

            {/* signout option */}
             {/* Signout Icon */}
          <div
            onClick={handleLogout}
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              background: "#fee2e2",
              borderRadius: "10px",
              color: "#dc2626",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <GoSignOut size={18} />
          </div>

          </div>

        </div>
      </nav>

      {/* ================= Sidebar ================= */}
            <Offcanvas show={show} onHide={handleClose} placement="end">
  <Offcanvas.Header closeButton>
    <Offcanvas.Title className="fw-bold">
      🛒 Your Cart
    </Offcanvas.Title>
  </Offcanvas.Header>

  <Offcanvas.Body>

    {data && data.length > 0 ? (
      data.map((item, index) => (

        <Card className="mb-3 shadow-sm border-0" key={index}>
          <Card.Body>
            <div className="d-flex">

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
                className="me-3"
              />

              {/* Content */}
              <div className="flex-grow-1">

                <h6 className="mb-1">{item.name}</h6>

                <small className="text-muted">
                  Price: ${item.price}
                </small>

                <div className="fw-bold text-warning mb-2">
                  Total: ${item.itemTotal}
                </div>

                <div className="d-flex align-items-center gap-2">

                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleDecrement(item.product_id)}
                  >
                    −
                  </Button>

                  <span className="fw-semibold">
                    {item.quantity}
                  </span>

                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleIncrement(item.product_id)}
                  >
                    +
                  </Button>

                </div>

              </div>
            </div>
          </Card.Body>
        </Card>

      ))
    ) : (
      <p className="text-center text-muted">
        Your cart is empty
      </p>
    )}

    {data.length > 0 && (
      <Button variant="warning" className="w-100 mt-3">
        Proceed to Checkout
      </Button>
    )}

  </Offcanvas.Body>
</Offcanvas>

    </>
  );
};

export default Navbar;





