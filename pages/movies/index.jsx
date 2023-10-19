import { Button, message } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import "react-circular-progressbar/dist/styles.css";

import { Router, useRouter } from "next/router";
import Card from "@/components/Movies/Card";
import SideBar from "@/components/Movies/SideBar";
import Head from "next/head";
import { useSelector } from "react-redux";
const Movies = ({ data }) => {
  const [movies, setMovies] = useState(data);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("popularity.desc");
  const [lang, setLang] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [avarageVote, setAvarageVote] = useState([0, 10]);

  const [genreList, setGenreList] = useState([]);
  const [hideLoadBtn, setHideLoadBtn] = useState(false);

  const router = useRouter();
  const watchListSlice = useSelector((state) => state?.watchList?.value);
  const favoriteListSlice = useSelector((state) => state?.favoriteList?.value);
  // Router.events.on("routeChangeStart", () => {
  //   setMovies(data);
  //   setPage(1);
  //   setSort("popularity.desc");
  //   setLang("");
  //   setGenreList([]);
  //   setHideLoadBtn(false);
  // });

  const handleLoadMore = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${
          process.env.NEXT_PUBLIC_TMDB_KEY
        }&page=${page + 1}${sort ? `&sort_by=${sort}` : null}${
          genreList?.length !== 0
            ? `&with_genres=${genreList?.map((i) => `${i.id},`)}`
            : ""
        }${lang !== "all" && lang ? `&with_original_language=${lang}` : ""}`
      );
      setPage(page + 1);

      setMovies([...movies, ...res?.data?.results]);
      if (res?.data?.results?.length < 20) {
        setHideLoadBtn(true);
      } else {
        setHideLoadBtn(false);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const targetRef = useRef(null);
  const targetRef2 = useRef(null);

  useEffect(() => {
    const options = {
      root: null, // Kök gözlem alanı (genellikle viewport)
      rootMargin: "0px", // Kök gözlem alanı etrafındaki marj
      threshold: 0.5, // Geçiş eşiği (0 ile 1 arasında)
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          targetRef2?.current?.classList?.add(["hidden"]);
          targetRef2?.current?.classList?.remove(["flex"]);
        } else {
          targetRef2?.current?.classList?.remove(["hidden"]);
          targetRef2?.current?.classList?.add(["flex"]);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-[url('/assets/auth-bg.jpg')] bg-fill pt-[75px] -mt-[65px]">
      <Head>
        <title>Movies</title>
      </Head>
      <div className="container flex flex-col md:flex-row gap-5 min-h-screen pb-10">
        <SideBar
          page={page}
          setPage={setPage}
          sort={sort}
          setSort={setSort}
          lang={lang}
          setLang={setLang}
          genreList={genreList}
          targetRef={targetRef}
          targetRef2={targetRef2}
          setGenreList={setGenreList}
          avarageVote={avarageVote}
          setAvarageVote={setAvarageVote}
          setMovies={setMovies}
          setHideLoadBtn={setHideLoadBtn}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        <div className="w-full md:w-[77%] ">
          {movies?.length === 0 ? (
            <div className="flex h-full text-white items-center flex-col gap-3">
              <div className="w-[300px] relative h-[300px] ">
                <Image
                  className="object-contain"
                  fill
                  src={"/assets/sad1.png"}
                  alt={"Ofenos"}
                ></Image>
              </div>
              <div>No items were found that match your query.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  gap-5">
              {movies?.map((movie, i) => (
                <Card
                  favoriteListSlice={favoriteListSlice}
                  watchListSlice={watchListSlice}
                  movie={movie}
                  key={i}
                />
              ))}
            </div>
          )}

          {hideLoadBtn ? null : (
            <Button
              type="button"
              size="large"
              className="bg-blue-400 mt-10  font-semibold w-full h-[40px] text-white flex items-center justify-center duration-300 hover:text-blue-400 hover:bg-white"
              onClick={() => handleLoadMore()}
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;

export const getStaticProps = async () => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&page=1`
    );

    return {
      props: {
        data: res?.data?.results,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: [],
      },
    };
  }
};
