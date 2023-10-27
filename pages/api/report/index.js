import dbConnect from "@/lib/dbConnect";
import Movie from "@/models/Movie";
import Reports from "@/models/Reports";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method === "GET") {
    try {
      const movies = await Reports.find().populate(`report_movie`);
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (method === "POST") {
    const { user, report_title, report_description, report_movie } =
      await req.body;
    if (!user || !report_title || !report_description || !report_movie) {
      res.status(500).json({
        message: "Please fill out the form completely",
      });
      return;
    }

    try {
      const saveReport = new Reports({
        user,
        report_title,
        report_description,
        report_movie,
      });
      await saveReport.save();
      return res.status(201).json({
        saveReport,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(user, report_title, report_description, report_movie);
  } else if (method === "DELETE") {
  } else {
    return res.status(400).json({
      message: "Method Not Allowed",
    });
  }
};

export default handler;
