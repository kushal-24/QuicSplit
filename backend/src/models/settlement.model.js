import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

//preventing settlement with myself
settlementSchema.pre("save", function (next) {
  if (this.from.toString() === this.to.toString()) {
    return next(new Error("Cannot settle with yourself"));
  }

  next();
});

const Settlement = mongoose.model("Settlement", settlementSchema);

export { Settlement };