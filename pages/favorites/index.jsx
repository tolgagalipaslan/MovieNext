import Card from "@/components/Favorites/Card";
import TvCard from "@/components/Favorites/TvCard";
import Title from "@/components/ui/Title";
import { Button } from "antd";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Favorites = ({ data }) => {
  const [favorites, setFavorites] = useState(data);
  const router = useRouter();
  const watchListSlice = useSelector((state) => state?.watchList?.value);
  const favoriteListSlice = useSelector((state) => state?.favoriteList?.value);

  return (
    <div className="h-fit py-5  w-full min-h-screen     bg-[url('/assets/auth-bg.jpg')] -mt-[65px] pt-[65px]  ">
      <div className="container text-white">
        {favorites?.length === 0 ? null : <Title>Favorites</Title>}
        {favorites?.length === 0 ? (
          <div className="min-h-screen  flex items-center justify-center w-full">
            <div className="w-1/3 mx-auto flex items-center justify-center flex-col">
              <div className=" object-cover w-full aspect-square relative">
                <Image fill src={"/assets/sad1.png"} alt="sad" />
              </div>
              <div className="text-center text-white text-xl py-2">
                Your Favorites list empty
              </div>
              <Button
                onClick={() => router.push("/movies")}
                type="button"
                className="bg-mainDarkRed text-white my-2"
              >
                Lets add something
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid p-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 container gap-3">
            {favorites?.map((item, i) =>
              item?.title ? (
                <Card
                  favoriteListSlice={favoriteListSlice}
                  watchListSlice={watchListSlice}
                  key={i}
                  movie={item}
                  setFavorites={setFavorites}
                />
              ) : (
                <TvCard
                  favoriteListSlice={favoriteListSlice}
                  watchListSlice={watchListSlice}
                  key={i}
                  tv={item}
                  setFavorites={setFavorites}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

export const getServerSideProps = async (context) => {
  try {
    const session = await getSession(context);

    const res = await axios.get(
      `${process.env.MAIN_URL}/api/favoriteList?queryId=${session?.user?.id}`
    );

    return {
      props: {
        data: res?.data?.favoriteList || [],
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
};
