import mongoose, { models } from "mongoose";

const reportsSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    report_title: {
      type: String,
      required: true,
    },
    report_description: {
      type: String,
      required: true,
    },
    report_movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reports = models?.Reports || mongoose.model("Reports", reportsSchema);
export default Reports;
