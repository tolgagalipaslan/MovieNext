import { setDataFav } from "@/redux/features/favorites";
import { setData } from "@/redux/features/watchList";
import ToggleFavoriteListItem from "@/utils/toggleFavoritesItem";
import ToggleWatchlistItem from "@/utils/toggleWatchlistItem";
import { Button, Tooltip, message } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { useMemo, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { BsFillBookmarkPlusFill, BsFillPlayFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
const Banner = ({ tv, cast, video }) => {
  const [arrow, setArrow] = useState("Show");
  const watchListSlice = useSelector((state) => state?.watchList?.value);
  const favoriteListSlice = useSelector((state) => state?.favoriteList?.value);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const handleToggleWatchListItem = async () => {
    try {
      if (!session) {
        router.push("/auth/login");
        return;
      }
      NProgress.start();
      const res = await ToggleWatchlistItem(session?.user?.id, tv);
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
      const res = await ToggleFavoriteListItem(session?.user?.id, tv);
      dispatch(setDataFav(res));

      message.success("The transaction was completed successfully");
    } catch (error) {
      console.log(error);
      message.error("Something went wrong!");
    } finally {
      NProgress.done();
    }
  };

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  return (
    <>
      <div
        className="bg-center bg-cover w-full h-fit py-5 lg:h-screen  lg:max-h-[550px] relative"
        style={{
          backgroundImage: `url(https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${tv?.backdrop_path})`,
        }}
      >
        <div className="absolute left-0 top-0 w-full h-full py-5 lg:h-screen  lg:max-h-[550px]   bg-black/50 z-20"></div>

        <div className="w-full h-full z-30 relative container  py-3 lg:py-10 flex items-center gap-10">
          <div className="relative hidden lg:flex  aspect-[9/16] min-w-[300px] h-full rounded-2xl overflow-hidden">
            <Image
              className=" "
              fill
              src={`${
                tv?.poster_path !== null
                  ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${tv?.poster_path}`
                  : tv?.backdrop_path !== null
                  ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${tv?.backdrop_path}`
                  : "/assets/default-img.png"
              }`}
              alt={tv?.name}
            />
          </div>
          <div className="flex flex-col gap-3 text-white ">
            <div className="flex flex-col gap-1 ">
              <div className="text-3xl">{tv?.name}</div>
              <div className="flex items-center gap-2">
                {tv?.adult ? (
                  <div className="text-mainLightRed">+18</div>
                ) : null}

                <div className="">{tv?.first_air_date}</div>
                <div className="w-1 h-1 rounded-full bg-white "></div>
                <div className="flex items-center gap-1 px-3 py-2">
                  {tv?.genres?.slice(0, 3)?.map((item, i) => (
                    <div key={i}>
                      {item?.name}
                      {i + 1 !== tv?.genres?.length ? "," : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-center ">
              <CircularProgressbar
                styles={buildStyles({
                  textColor:
                    tv?.vote_average > 7
                      ? "#21d07a"
                      : tv?.vote_average > 4
                      ? "#d2d531"
                      : tv?.vote_average === 0
                      ? "#838383"
                      : "#db2360 ",
                  pathColor:
                    tv?.vote_average > 7
                      ? "#21d07a"
                      : tv?.vote_average > 4
                      ? "#d2d531"
                      : tv?.vote_average === 0
                      ? "#838383"
                      : "#db2360 ",
                  trailColor:
                    tv?.vote_average > 7
                      ? "#204529"
                      : tv?.vote_average > 4
                      ? "#423d0f"
                      : tv?.vote_average === 0
                      ? "#838383"
                      : "#571435 ",
                })}
                className="w-20 bg-mainBlack2 p-2 rounded-full font-semibold"
                value={tv?.vote_average === 0 ? "NR" : tv?.vote_average * 10}
                text={`${
                  tv?.vote_average === 0
                    ? "NR"
                    : (tv?.vote_average * 10).toString()?.slice(0, 5) + "%"
                }`}
              />
              <div className="font-semibold text-xl">
                User <br /> Score
              </div>
              <Tooltip
                color="#2b2d42"
                placement="bottom"
                title={"Marks as Favorite"}
                arrow={mergedArrow}
              >
                <Button
                  type="button"
                  className={`bg-mainBlack h-full aspect-square flex items-center justify-center ${
                    favoriteListSlice?.find((i) => i.id === tv?.id)
                      ? "text-mainDarkRed"
                      : "text-white"
                  }`}
                  onClick={() => handleToggleFavoriteListItem()}
                  shape="round"
                >
                  <AiFillHeart />
                </Button>
              </Tooltip>{" "}
              <Tooltip
                color="#2b2d42"
                placement="bottom"
                title={"Rate it"}
                arrow={mergedArrow}
              >
                <Button
                  type="button"
                  className="text-white bg-mainBlack h-full aspect-square flex items-center justify-center"
                  shape="round"
                >
                  <AiFillStar />
                </Button>
              </Tooltip>{" "}
              <Tooltip
                color="#2b2d42"
                placement="bottom"
                title={"WatchList"}
                arrow={mergedArrow}
              >
                <Button
                  type="button"
                  onClick={() => handleToggleWatchListItem()}
                  className={` bg-mainBlack h-full aspect-square flex items-center justify-center ${
                    watchListSlice?.find((i) => i.id === tv?.id)
                      ? "text-mainDarkRed"
                      : " text-white"
                  }`}
                  shape="round"
                >
                  <BsFillBookmarkPlusFill />
                </Button>
              </Tooltip>
              {video?.length !== 0 ? (
                <Tooltip
                  color="#2b2d42"
                  placement="bottom"
                  title={"Play Trailer"}
                  arrow={mergedArrow}
                >
                  <Link
                    href={"#trailer-wrapper"}
                    className="text-white  flex items-center cursor-pointer text-xl font-semibold"
                  >
                    <Button
                      type="button"
                      className="text-white bg-mainBlack h-full aspect-square flex items-center justify-center"
                      shape="round"
                    >
                      <BsFillPlayFill />
                    </Button>
                  </Link>
                </Tooltip>
              ) : null}
            </div>
            <i className="text-gray-300/90 text-xl italic">{tv?.tagline}</i>
            <div className="text-xl font-semibold">Overwiew</div>
            <div className=" font-semibold line-clamp-3">
              {tv?.overview ||
                "No overview has been specified for this content."}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
              {cast?.cast?.slice(0, 6).map((item, i) => (
                <div key={i} className="flex flex-col gap-0 ">
                  <div className="font-semibold text-xl ">{item?.name}</div>
                  <div>{item?.character}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
