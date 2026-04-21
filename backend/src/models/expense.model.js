import mongoose, {Schema} from "mongoose";

const participantSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  share: {
    type: Number,
    required: true,
    min: 0,
  },
});

const expenseSchema = new mongoose.Schema(
  {
    expenseName:{
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    participants: {
      type: [participantSchema],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "At least one participant required",
      },
    },
    // optional: link to uploaded bill/image
    // file: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "File",
    // },
  },
  { timestamps: true }
);

//ensure ths plit is balanced and equal to the total amount paid
expenseSchema.pre("save", function (next) {
  const total = this.participants.reduce((sum, p) => sum + p.share, 0);

  if (Math.abs(total - this.amount) > 0.01) {  // ✅ tolerance of 1 paisa
    throw new Error("Total shares must equal expense amount");
  }

});

export const Expense = mongoose.model('Expense', expenseSchema);

