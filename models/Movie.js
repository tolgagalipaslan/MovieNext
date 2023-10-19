import mongoose, { models } from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    movie_id: {
      type: Number, // Veya uygun veri türünü kullanabilirsiniz
      required: true,
      unique: true,
    },
    movie_url: {
      type: String, // Veya uygun veri türünü kullanabilirsiniz
      required: true,
    },
    movie_data: {
      type: Object,
    },
    movie_overview: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = models?.Movie || mongoose.model("Movie", movieSchema);
export default Movie;
