import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    // OCR raw textt(VERY useful)
    ocrText: {
      type: String,
    },

    // extracted data (optional caching)
    extractedAmount: {
      type: Number,
    },

    extractedTitle: {
      type: String,
    },

    type: {
      type: String,
      enum: ["image", "pdf"],
      default: "image",
    }
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;