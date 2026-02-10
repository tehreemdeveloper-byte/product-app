import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
    {
        name: { type: String, default: "" },
        file_url: { type: String, default: "" },
        user_id: { type: Schema.Types.ObjectId, ref: "tbl_user", default: null },
        // new attribute added here 
        file_size: { type: Number, default: null },
        file_type: { type: String, default: "" },
        file_path: { type: String, default: "" },
        file_key: { type: String, default: "" },
        expire_at: { type: Date, default: null },
        // new attribute ended here 
        is_deleted: { type: Boolean, default: false },
    },

    { timestamps: true }
);

const mediaModel = mongoose.model("tbl_media", mediaSchema);
export default mediaModel;