import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    courseId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    studentName: { type: String },
    age: { type: Number },
    education: { type: String },
    reason: { type: String },
    additionalInfo: { type: String },
}, { timestamps: true });

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
