import dbConnect from "@/lib/dbConnect";
import Movie from "@/models/Movie";
import Topten from "@/models/Topten";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method === "GET") {
    const { query } = req.query;
    const querysearch = { "movie_data.movie.original_title": query };
    const movies = await Movie.find({
      "movie_data.movie.original_title": { $regex: new RegExp(query, "i") },
    }).limit(5);
    return res.status(200).json(movies);
  } else if (method === "POST") {
    const { id } = await req.body;
    if (!id) {
      res.status(500).json({
        message: "Please fill out the form completely",
      });
      return;
    }
    try {
      const toptenfind = await Topten.find({ top_movie: id });
      if (toptenfind.length === 0) {
        const saveTopten = new Topten({
          top_movie: id,
        });
        await saveTopten.save();
        return res.status(201).json({
          saveTopten,
        });
      } else {
        return res
          .status(500)
          .json({ error: "This movie already addet TOP 10!" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (method === "PATCH") {
  } else {
    return res.status(400).json({
      message: "Method Not Allowed",
    });
  }
};

export default handler;
