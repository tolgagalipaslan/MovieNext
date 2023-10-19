// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import Title from "../ui/Title";
import MovieCard from "./MovieCard";
import useWindowWidth from "@/hooks/useWindowWith";
import { useEffect } from "react";
import { useState } from "react";

const PopularMovies = ({ movies, watchListSlice, favoriteListSlice }) => {
  const [isSmallScreenState, setIsSmallScreenState] = useState(false);
  const width = useWindowWidth();
  const isSmallScreen = width <= 600;

  useEffect(() => {
    if (isSmallScreen) {
      setIsSmallScreenState(true);
    } else {
      setIsSmallScreenState(false);
    }
  }, [width]);
  return (
    <div className="overflow-hidden">
      <div className="container">
        <Title>Popular Movies</Title>
        {isSmallScreenState ? (
          <div className="flex gap-5 container overflow-auto pb-2 p-0  castlist-scroll ">
            {movies?.map(
              (movie, i) =>
                movie?.backdrop_path && (
                  <div key={i} className="h-[231px] aspect-[9/14] ">
                    <MovieCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      movie={movie}
                    />
                  </div>
                )
            )}
          </div>
        ) : (
          <Swiper
            initialSlide={20}
            slidesPerView={1}
            spaceBetween={10}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              400: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              550: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 7,
                spaceBetween: 10,
              },
            }}
            loop={true}
            navigation={true}
            modules={[Navigation]}
            className=" list-swiper overflow-visible"
          >
            {movies?.map(
              (movie, i) =>
                movie?.backdrop_path && (
                  <SwiperSlide key={i}>
                    <MovieCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      movie={movie}
                    />
                  </SwiperSlide>
                )
            )}
            {movies?.map(
              (movie, i) =>
                movie?.backdrop_path && (
                  <SwiperSlide key={i}>
                    <MovieCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      movie={movie}
                    />
                  </SwiperSlide>
                )
            )}
            {movies?.map(
              (movie, i) =>
                movie?.backdrop_path && (
                  <SwiperSlide key={i}>
                    <MovieCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      movie={movie}
                    />
                  </SwiperSlide>
                )
            )}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default PopularMovies;
