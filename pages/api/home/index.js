import dbConnect from "@/lib/dbConnect";
import Movie from "@/models/Movie";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method === "GET") {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } else if (method === "POST") {
    const { popular } = await req.body;
    const movies = await Movie.find();

    // 20 popular movie'yi tutacak bir dizi oluşturun
    const popularMovies = [];

    // Döngü ile her bir popüler filmi kontrol edin
    for (let i = 0; i < popular.length; i++) {
      const popularMovieId = popular[i].id;

      // Movie datasındaki filmler arasında bu ID'yi arayın
      const matchingMovie = movies.find(
        (movie) => movie.movie_data.movie.id === popularMovieId
      );

      if (matchingMovie) {
        popularMovies.push(matchingMovie);
      }
    }

    // Eğer popularMovies dizisi 12'den azsa, en popüler filmleri ekleyin
    while (popularMovies.length < 12) {
      // Movie datasındaki filmler arasında popularity'ye göre sıralayın
      movies.sort(
        (a, b) => b.movie_data.movie.popularity - a.movie_data.movie.popularity
      );

      // En popüler filmi alın
      const mostPopularMovie = movies.shift();

      // Bu film daha önce eklenmediyse popularMovies dizisine ekleyin
      if (
        !popularMovies.some(
          (movie) =>
            movie.movie_data.movie.id === mostPopularMovie.movie_data.movie.id
        )
      ) {
        popularMovies.push(mostPopularMovie);
      }
    }
    return res.status(200).json(popularMovies);
  } else if (method === "DELETE") {
  } else {
    return res.status(400).json({
      message: "Method Not Allowed",
    });
  }
};

export default handler;
