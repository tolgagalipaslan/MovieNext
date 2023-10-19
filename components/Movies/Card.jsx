import ToggleWatchlistItem from "@/utils/toggleWatchlistItem";
import { Dropdown, Space, message } from "antd";

import { useSession } from "next-auth/react";
import Image from "next/image";

import { useRouter } from "next/router";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import NProgress from "nprogress";
import { setData } from "@/redux/features/watchList";
import { useDispatch } from "react-redux";
import ToggleFavoriteListItem from "@/utils/toggleFavoritesItem";
import { setDataFav } from "@/redux/features/favorites";
const Card = ({ movie, watchListSlice, favoriteListSlice }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const handleToggleWatchListItem = async () => {
    try {
      if (!session) {
        router.push("/auth/login");
        return;
      }
      NProgress.start();
      const res = await ToggleWatchlistItem(session?.user?.id, movie);
      dispatch(setData(res));
      message.success("The transaction was completed successfully");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!");
    } finally {
      NProgress.done();
    }
  };
  const handleToggleFavoriteListItem = async () => {
    try {
      if (!session) {
        router.push("/auth/login");
        return;
      }
      NProgress.start();
      const res = await ToggleFavoriteListItem(session?.user?.id, movie);
      dispatch(setDataFav(res));

      message.success("The transaction was completed successfully");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!");
    } finally {
      NProgress.done();
    }
  };

  const items = [
    {
      label: (
        <div
          onClick={() => handleToggleWatchListItem()}
          className={`flex items-center gap-1 px-3 py-2 ${
            watchListSlice?.find((i) => i.id === movie?.id)
              ? "text-mainDarkRed"
              : " text-black"
          }`}
        >
          <BsFillBookmarkPlusFill className="text-lg" />
          Watchlist
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div
          className={`flex items-center gap-1  px-3 py-2 ${
            favoriteListSlice?.find((i) => i.id === movie?.id)
              ? "text-mainDarkRed"
              : " text-black"
          }`}
          onClick={() => handleToggleFavoriteListItem()}
        >
          <AiFillHeart className="text-lg" />
          Favorites
        </div>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div className="flex items-center gap-1 px-3 py-2">
          <AiFillStar className="text-lg" />
          Your rating
        </div>
      ),
      key: "2",
    },
  ];
  return (
    <div className="w-full group relative cursor-pointer flex items-center sm:items-start flex-row sm:flex-col  rounded sm:rounded-xl overflow-hidden h-full bg-cover bg-mainBlack2">
      <div className="absolute top-2 right-2 z-30">
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          className="group-hover:opacity-100 opacity-0  select-none"
        >
          <div onClick={(e) => e.preventDefault()}>
            <Space className="bg-white/80 text-2xl rounded-full hover:bg-blue-600 duration-300  ">
              <BiDotsHorizontalRounded />
            </Space>
          </div>
        </Dropdown>
      </div>
      <div
        onClick={() =>
          router.push(
            `/movie-details/${movie.id}-${movie?.title
              ?.toLowerCase()
              .replace(/ /g, "-")}`
          )
        }
        className="relative h-[160px] sm:h-auto  sm:w-full aspect-[9/12] sm:aspect-[9/11] "
      >
        <Image
          src={`${
            movie?.backdrop_path
              ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie?.backdrop_path}`
              : movie?.poster_path
              ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie?.poster_path}`
              : "/assets/default-img.png"
          }`}
          alt={movie?.title}
          fill
          className="bg-[url(/assets/logo1.png)] bg-white bg-center object-center object-cover bg-cover bg-no-repeat"
        />
        <CircularProgressbar
          styles={buildStyles({
            textColor:
              movie?.vote_average > 7
                ? "#21d07a"
                : movie?.vote_average > 4
                ? "#d2d531"
                : movie?.vote_average === 0
                ? "#838383"
                : "#db2360 ",
            pathColor:
              movie?.vote_average > 7
                ? "#21d07a"
                : movie?.vote_average > 4
                ? "#d2d531"
                : movie?.vote_average === 0
                ? "#838383"
                : "#db2360 ",
            trailColor:
              movie?.vote_average > 7
                ? "#204529"
                : movie?.vote_average > 4
                ? "#423d0f"
                : movie?.vote_average === 0
                ? "#838383"
                : "#571435 ",
          })}
          className="w-14 h-14  items-center justify-center bg-mainBlack2 p-1 rounded-full font-semibold hidden sm:flex absolute -bottom-7 right-3 z-20"
          value={movie?.vote_average === 0 ? "NR" : movie?.vote_average * 10}
          text={`${
            movie?.vote_average === 0
              ? "NR"
              : (movie?.vote_average * 10).toString()?.slice(0, 5) + "%"
          }`}
        />
      </div>

      <div
        onClick={() =>
          router.push(
            `/movie-details/${movie.id}-${movie?.title
              ?.toLowerCase()
              .replace(/ /g, "-")}`
          )
        }
        className=" p-5 pt-8 flex flex-col gap-1 text-white"
      >
        <div className="font-semibold line-clamp-1">{movie?.title}</div>
        <div className="text-mainWhite/60">{movie?.release_date}</div>

        <div className="text-mainWhite sm:hidden line-clamp-2">
          {movie?.overview}
        </div>
      </div>
    </div>
  );
};

export default Card;
