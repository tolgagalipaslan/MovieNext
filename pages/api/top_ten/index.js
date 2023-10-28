import dbConnect from "@/lib/dbConnect";
import Movie from "@/models/Movie";
import Topten from "@/models/Topten";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method === "GET") {
    const { query } = req.query;
    const movies = await Topten.find().populate("top_movie");
    return res.status(200).json(movies);
  } else if (method === "POST") {
  } else if (method === "PATCH") {
  } else {
    return res.status(400).json({
      message: "Method Not Allowed",
    });
  }
};

export default handler;
