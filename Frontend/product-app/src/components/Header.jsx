import React from 'react'

const Header = () => {
  return (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Products</h2>
            <p className="text-muted mb-0">
              Browse our curated collection
            </p>
          </div>

          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            style={{ maxWidth: "250px" }}
          />
        </div>
  )
}

export default Header