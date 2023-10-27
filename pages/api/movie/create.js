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
    var filmAdi = movieData.movie.original_title;
    var aciklama = movieOverview;
    var oyuncuIsimleri = movieData?.cast?.cast?.map(function (actor) {
      return actor.name;
    });
    var genres = movieData?.movie?.genres?.map(function (actor) {
      return actor.name;
    });
    var tur = genres.join(", ");
    var puan = movieData.movie.vote_average;
    var vizyonTarihi = movieData.movie.release_date;
    var oyuncular = oyuncuIsimleri.slice(0, 3).join(", "); // İlk üç oyuncuyu al
    var metaAciklama = `${filmAdi} - ${aciklama}. Tür: ${tur}. IMDb Puanı: ${puan}. Vizyon Tarihi: ${vizyonTarihi}.`;

    // Meta açıklamanın karakter sınırını kontrol et (150-160 karakter)
    if (metaAciklama.length > 160) {
      // Eğer meta açıklama sınırı aşılıyorsa, daha kısa bir sürümünü oluştur
      metaAciklama = `${filmAdi} - ${aciklama.substring(
        0,
        100
      )}... İzlemek için tıklayın!`;
    }
    try {
      const saveMovie = new Movie({
        movie_id: movieId,
        movie_url: movieURL,
        movie_data: movieData,
        movie_overview: movieOverview,
        movie_meta: metaAciklama,
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
