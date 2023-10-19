import Banner from "@/components/MovieDetails/Banner";
import CastList from "@/components/MovieDetails/CastList";

import Trailer from "@/components/MovieDetails/Trailer";

import axios from "axios";
import Head from "next/head";

const MovieDetails = ({ movie, cast, video }) => {
  return (
    <div className=" ">
      <Head>
        <title>{movie?.title || "Ofenos"}</title>
        <meta name="description" content={movie?.overview} />
      </Head>
      <div className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-[-1] w-[80vh] aspect-square rounded-full blur-[150px] bg-mainWhite/50"></div>
      <Banner video={video} movie={movie} cast={cast} />
      <CastList cast={cast} />
   

      <Trailer video={video} cast={cast} />
    </div>
  );
};

export default MovieDetails;

export const getServerSideProps = async (context) => {
  const slug = context.query.slug;
  const id = slug.split("-")[0];

  try {
    const populatedMovieRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );

    const castAndCrewRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const videoRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );

    return {
      props: {
        movie: populatedMovieRes?.data,
        cast: castAndCrewRes?.data,
        video: videoRes?.data?.results,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        movie: [],
        cast: [],
        video: [],
      },
    };
  }
};
