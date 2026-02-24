import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true
    },

    // 🔹 Full membership fee
    totalAmount: {
      type: Number,
      required: true
    },

    // 🔹 Amount actually paid
    paidAmount: {
      type: Number,
      required: true
    },

    // 🔹 Remaining amount (auto calculated from controller)
    remainingAmount: {
      type: Number,
      required: true,
      default: 0
    },

    // 🔹 Payment method
    method: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Razorpay", "Manual"],
      default: "Manual"
    },

    // 🔹 Payment status
    status: {
      type: String,
      enum: ["Completed", "Pending"],
      default: "Completed",
      index: true
    },

    // 🔹 Razorpay specific fields
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },

    razorpayOrderId: {
      type: String
    },

    // 🔹 Optional notes
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

/* =========================================
   🔥 INDEXES (Performance Boost)
========================================= */
paymentSchema.index({ member: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;