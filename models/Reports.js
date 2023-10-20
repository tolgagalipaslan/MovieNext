import mongoose, { models } from "mongoose";

const reportsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    report_title: {
      type: String,
      required: true,
    },
    report_description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reports = models?.Reports || mongoose.model("Reports", reportsSchema);
export default Reports;
