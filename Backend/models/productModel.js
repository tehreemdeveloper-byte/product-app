import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      default: "" 
    },

    price: { 
      type: Number, 
      required: true,
      trim: true,
      
    },

    description: { 
      type: String,
      trim: true,
      default: "" 
    },

  tags: {
  type: [String],
  default: []
},




    is_deleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    timestamps: true 
  }
);

const productModel = mongoose.model("tbl_product", productSchema);
export default productModel;
