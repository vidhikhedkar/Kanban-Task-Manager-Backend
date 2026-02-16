import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    column: {
      type: String,
      enum: ["todo", "inProgress", "done"],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
