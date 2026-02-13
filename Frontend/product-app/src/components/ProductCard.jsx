import React from "react";

const ProductCard = ({ image, category,title,description,price,tags = [],
}) => {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="card h-100 shadow-lg border-0 rounded-4">

        <img
          src={image}
          className="card-img-top rounded-top-4"
          alt={title}
          style={{ height: "250px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">
          <small className="text-warning fw-bold text-uppercase">
            {category}
          </small>

          <h5 className="fw-bold mt-2">{title}</h5>

          <p className="text-muted small">
            {description}
          </p>

          {/* ✅ TAGS SECTION */}
          <div className="mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="badge bg-light text-dark me-2 mb-2 border"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            <h6 className="fw-bold mb-0">${price}</h6>

            <button
              className="btn btn-sm text-white"
              style={{
                background:
                  "linear-gradient(135deg, #f97316, #f59e0b)",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
