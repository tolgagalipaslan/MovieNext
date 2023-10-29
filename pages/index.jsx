import ArtistList from "@/components/Home/ArtistList";
import Banner from "@/components/Home/Banner";
import PopularMovies from "@/components/Home/PopularMovies";
import PopularTv from "@/components/Home/PopularTv";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Home = ({ artist, movies, tv, horror }) => {
  const watchListSlice = useSelector((state) => state?.watchList?.value);
  const favoriteListSlice = useSelector((state) => state?.favoriteList?.value);
  const [popularMovies, setPopularMovies] = useState([]);
  const getPopular = async (movies) => {
    const res = await axios.post("/api/home", {
      popular: movies,
    });
    setPopularMovies(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    getPopular(movies);
  }, [movies]);
  return (
    <div className=" ">
      <Head>
        <title>Ofenos Movies</title>
      </Head>

      <div className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-[-1] w-[80vh] aspect-square rounded-full blur-[550px] bg-mainWhite/50"></div>
      <Banner />

      <div className="flex flex-col pb-10">
        <ArtistList artist={artist} />
        <PopularMovies
          watchListSlice={watchListSlice}
          favoriteListSlice={favoriteListSlice}
          movies={popularMovies}
        />
        <PopularTv
          watchListSlice={watchListSlice}
          favoriteListSlice={favoriteListSlice}
          tv={tv}
        />
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  try {
    const artistRes = await axios.get(
      `https://api.themoviedb.org/3/person/popular?language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );

    const tvRes = await axios.get(
      `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const horror = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=27&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const comedy = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=35&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const action = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const mystery = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=9648&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const family = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=10751&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const fantasy = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=14&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );

    return {
      props: {
        artist: artistRes?.data?.results,
        movies: movieRes?.data?.results,
        tv: tvRes?.data?.results,
        horror: horror?.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        artist: [],
        movies: [],
        tv: [],
      },
    };
  }
};

export default Home;
