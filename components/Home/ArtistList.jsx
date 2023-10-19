import { Avatar } from "antd";
import React from "react";
import Title from "../ui/Title";
import Link from "next/link";
import Image from "next/image";

const ArtistList = ({ artist }) => {
  const newlist = artist?.filter((i) => i?.profile_path !== null);
  return (
    <div className="container py-10">
      <Title>Popular Artist</Title>
      <div className=" grid  grid-cols-6 md:grid-cols-12 items-center gap-2 md:gap-5 overflow-hidden  ">
        {artist?.length !== 0
          ? newlist?.slice(0, 12).map(
              (item, i) =>
                item?.profile_path && (
                  <Link
                    href={`/person/${item?.name
                      ?.toLowerCase()
                      .replace(/ /g, "-")}`}
                    key={i}
                    className="w-full h-full aspect-square border-[2px] md:border-[4px] border-mainDarkRed cursor-pointer relative rounded-full"
                  >
                    <Image
                      alt={item?.name}
                      width={300}
                      height={300}
                      placeholder="blur"
                      blurDataURL={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${item?.profile_path}`}
                      className="object-cover object-center rounded-full w-full h-full"
                      src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${item?.profile_path}`}
                      loading="lazy"
                    />
                  </Link>
                )
            )
          : null}
      </div>
    </div>
  );
};

export default ArtistList;
