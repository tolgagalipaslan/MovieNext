import dbConnect from "@/lib/dbConnect";
import Movie from "@/models/Movie";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method === "GET") {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } else if (method === "POST") {
    const { movieData, movieURL, movieId, movieOverview } = await req.body;
    if (!movieData || !movieURL || !movieId || !movieOverview) {
      res.status(500).json({
        message: "Please fill out the form completely",
      });
      return;
    }

    try {
      const saveMovie = new Movie({
        movie_id: movieId,
        movie_url: movieURL,
        movie_data: movieData,
        movie_overview: movieOverview,
      });
      await saveMovie.save();
      return res.status(201).json({
        saveMovie,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (method === "DELETE") {
  } else {
    return res.status(400).json({
      message: "Method Not Allowed",
    });
  }
};

export default handler;
