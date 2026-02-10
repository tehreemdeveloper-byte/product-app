import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        first_name: { type: String, default: "" },
        last_name: { type: String, default: "" },
        email: { type: String, required: true },
        city: { type: String, default: "" },
        country: { type: String, default: "" },
        zip_code: { type: Number, default: "" },
        description: { type: String, default: "" },
        phone_number: { type: String, default: "" },
        password: { type: String, default: "", select: false },
        picture: { type: Schema.Types.ObjectId, ref: "tbl_media", default: null },
        status: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false },
        role_id: { type: Schema.Types.ObjectId, ref: "tbl_role" },
        payment_status: { type: Boolean, default: false },
        company_id: { type: Schema.Types.ObjectId, ref: "tbl_company", default: null },
        token: { type: String, default: "" },
        expiration_time: {type: Date, default:null},
        onboarding: {
            currentStep: { type: Number }, // 1 to N
            completedSteps: [{ type: Number, default: [] }],    // Optional: Track which steps are completed
            isOnboardingComplete: { type: Boolean, default: false },
            stepActionName: { type: String, default: "" },
            
        },
        connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tbl_user' }],
        connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tbl_user' }],
        sentRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tbl_user' }],
        isVarified: { type: Boolean, default: false },
        // new field
        jobMatchingEmail: { type: Boolean, default: false },
        pushnotification: { type: Boolean, default: false },
        newsNotifications: { type: Boolean, default: false },
        otp: { type: Number, default: null },
        ref: { type: String, default: "" }
    },
    { timestamps: true }
);

const userModel = mongoose.model("tbl_user", userSchema);
export default userModel;




// acha listen ak seprate schema bany ga jis k ander userid or token ayee ga or patch ki request bnayee gy 

// ager created h to to bus update ker dy gy or ager created nahi h to thk h or ager created anhi h 
// to patch kerwa dy 

// delete kerna h us ma fcm token ko khatam ker daina h mtlb usko hard delete hi ker daina h 

// bajny sa phly percentage calculate kerna h notification 
// or ager kisi ko notification nahi jata to fcm token ko remove ker daina h 

// or ya kam usi ma ker skty jo phly sa bna huwa h controller