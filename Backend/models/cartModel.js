import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'tbl_user',
            default:null
        },
       
        totalPrice: {type: Number, default: 0},
        items: [{
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'tbl_product'},
            quantity: {type: Number, default: 1}, //how many itmes he has selected this one
            price: {type: Number, default: 0}
        }],
        
        is_deleted: { 
            type: Boolean, 
            default: false 
        },

        
       
    },
     { timestamps: true }
);
const cartModel  = mongoose.model("tbl_cartSchema", cartSchema);
export default cartModel ;