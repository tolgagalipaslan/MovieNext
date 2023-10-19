import mongoose, { models } from "mongoose";

const ReportCommentSchema = mongoose.Schema(
  {
    whichComment: { type: String, required: true },
    whoReported: { type: String, required: true },
    why: { type: String, maxlength: 255 },
  },
  { timestamps: true }
);

const ReportComment =
  models?.ReportComment || mongoose.model("ReportComment", ReportCommentSchema);

export default ReportComment;
