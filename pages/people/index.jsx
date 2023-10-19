import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

const People = ({ data }) => {
  const [people, setPeople] = useState(data);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef();

  const handleScroll = () => {
    const div = scrollContainerRef.current;

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        div.scrollHeight &&
      !isLoading
    ) {
      getMorePerson();
    }
  };

  const getMorePerson = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.themoviedb.org/3/trending/person/week?api_key=${
          process.env.NEXT_PUBLIC_TMDB_KEY
        }&page=${page + 1}`
      );
      setPage(page + 1);

      setPeople([...people, ...res?.data?.results]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);
  return (
    <div className="h-fit py-5  w-full    bg-[url('/assets/auth-bg.jpg')] -mt-[65px] pt-[65px]  bg-center">
      <Head>
        <title>Popular People</title>
      </Head>
      <div
        ref={scrollContainerRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 container gap-3"
      >
        {people?.map((person, i) => (
          <Link
            href={`/person/${person?.name?.toLowerCase().replace(/ /g, "-")}`}
            key={i}
            className="bg-mainBlack text-white "
          >
            <Image
              width={500}
              height={500}
              className="object-cover w-full aspect-[9/11]"
              placeholder="blur"
              blurDataURL={`${
                person?.profile_path !== null
                  ? `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${person?.profile_path}`
                  : "/assets/default-img.png"
              }`}
              src={`${
                person?.profile_path !== null
                  ? `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${person?.profile_path}`
                  : "/assets/default-img.png"
              }`}
              alt={person?.name}
              loading="lazy"
            />
            <div className="p-3">
              <div className="line-clamp-1">{person?.name}</div>
              <div className="line-clamp-1 text-gray-400/90">
                {person?.known_for_department}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        className={`${
          isLoading ? "flex" : "hidden"
        }  items-center justify-center p-5 text-white`}
      >
        <div>
          <BiLoaderAlt className="animate-spin text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default People;

export const getStaticProps = async () => {
  const res = await axios.get(
    `https://api.themoviedb.org/3/trending/person/week?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&page=1`
  );

  try {
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
