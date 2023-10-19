// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import Title from "../ui/Title";
import TvCard from "./TvCard";
import useWindowWidth from "@/hooks/useWindowWith";
import { useState } from "react";
import { useEffect } from "react";

const PopularTv = ({ tv, watchListSlice, favoriteListSlice }) => {
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
        <Title>Popular Tv Shows</Title>
        {isSmallScreenState ? (
          <div className="flex gap-5 container overflow-auto pb-2 p-0  castlist-scroll ">
            {tv?.map(
              (tv, i) =>
                tv?.backdrop_path && (
                  <div key={i} className="h-[231px] aspect-[9/14] ">
                    <TvCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      tv={tv}
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
            {tv?.map(
              (tv, i) =>
                tv?.backdrop_path && (
                  <SwiperSlide key={i}>
                    <TvCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      tv={tv}
                    />
                  </SwiperSlide>
                )
            )}{" "}
            {tv?.map(
              (tv, i) =>
                tv?.backdrop_path && (
                  <SwiperSlide key={i}>
                    <TvCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      tv={tv}
                    />
                  </SwiperSlide>
                )
            )}{" "}
            {tv?.map(
              (tv, i) =>
                tv?.backdrop_path && (
                  <SwiperSlide key={i}>
                    <TvCard
                      favoriteListSlice={favoriteListSlice}
                      watchListSlice={watchListSlice}
                      tv={tv}
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

export default PopularTv;
