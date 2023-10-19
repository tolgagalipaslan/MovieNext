import useScrollPast65px from "@/hooks/scrollPast65px";
import { Button, Dropdown, Input, Space } from "antd";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineSearch,
} from "react-icons/ai";
import { BsBookmarkPlus, BsFillPersonFill, BsTv } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLocalMovies, MdOutlineLogout } from "react-icons/md";
const Navbar = () => {
  const [mobilNavOpen, setMobilNavOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const scrolled = useScrollPast65px();
  const { pathname, query } = useRouter();
  const router = useRouter();

  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const searchBtnRef = useRef(null);

  const { data: session } = useSession();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target) &&
        searchBtnRef.current &&
        !searchBtnRef.current.contains(event.target)
      ) {
        closeSearch();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchWrapperRef, searchBtnRef]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResult("");
  };

  const handleSearch = async (e) => {
    if (e.target.value.trim() === "") {
      setSearchQuery(e.target.value.trim());
    }
    setSearchQuery(e.target.value);

    if (e.target.value.trim() === "") {
      setSearchResult([]);
    } else {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1&query=${e.target.value}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
      );

      setSearchResult(res?.data?.results?.slice(0, 10));
    }
  };

  useEffect(() => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResult("");
    setMobilNavOpen(false);
  }, [pathname, query]);

  const handleSearchBtn = () => {
    setShowSearch(!showSearch);
    setSearchQuery("");
    setSearchResult("");
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handlePressEnter = () => {
    if (searchResult?.length !== 0) {
      if (searchResult[0]?.media_type === "movie") {
        router.push(
          `/movie-details/${searchResult[0]?.id}-${searchResult[0]?.title
            ?.toLowerCase()
            .replace(/ /g, "-")}`
        );
      } else if (searchResult[0]?.media_type === "tv") {
        router.push(
          `/tv-details/${searchResult[0]?.id}-${searchResult[0]?.name
            ?.toLowerCase()
            .replace(/ /g, "-")}`
        );
      } else if (searchResult[0]?.media_type === "person") {
        router.push(
          `/person/${searchResult[0]?.name?.toLowerCase().replace(/ /g, "-")}`
        );
      }
    } else {
      return;
    }
  };

  const hideNavbar =
    pathname === "/404" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register";

  const items = [
    {
      label: (
        <Link
          className="flex items-center gap-1 px-3 py-2 pr-6"
          href={"/favorites"}
        >
          <AiOutlineHeart className="text-lg" /> Favorites
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link
          className="flex items-center gap-1 px-3 py-2 pr-6"
          href={"/watchlist"}
        >
          <BsBookmarkPlus className="text-lg" /> Watchlist
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link
          className="flex items-center gap-1 px-3 py-2 pr-6"
          href={"/settings"}
        >
          <FiSettings className="text-lg" /> Settings
        </Link>
      ),
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          onClick={() => signOut()}
          className="flex items-center gap-1 px-3 py-2 cursor-pointer pr-6"
        >
          <MdOutlineLogout className="text-lg" /> Logout
        </div>
      ),
      key: "4",
    },
  ];

  return (
    <div className={`${hideNavbar ? "hidden" : ""}`}>
      <div
        className={`fixed top-0 left-0 w-full z-40 h-[65px] bg-mainBlack2 ${
          scrolled ? "lg:bg-mainBlack2/70 backdrop-blur-lg" : "lg:bg-black/0"
        } `}
      >
        <div className="container flex items-center justify-between w-full h-full text-white">
          <div className="flex items-center gap-5">
            {" "}
            <Link href={"/"} className="flex items-center gap-2">
              <div className="relative w-[50px] aspect-square flex items-center gap-0">
                <Image
                  className="object-contain"
                  fill
                  src={"/assets/logo1.png"}
                  alt="Ofenos"
                />
              </div>
              <div className=" text-transparent bg-clip-text bg-gradient-to-b text-3xl font-extrabold from-mainWhite to-mainDarkRed ml-[-5px]">
                Ofenos
              </div>
            </Link>
            <div
              className={`${
                mobilNavOpen ? "h-[176px] pb-5" : "h-0"
              } lg:h-fit overflow-hidden flex flex-col justify-center w-full items-center gap-5 absolute top-[65px] left-0 lg:relative lg:top-auto lg:left-auto lg:w-fit lg:justify-start lg:flex-row bg-mainBlack2 lg:bg-transparent lg:pb-0 duration-300 `}
            >
              <Link
                href={"/"}
                className={`font-semibold hover:text-mainDarkRed duration-300 ${
                  pathname === "/" ? "text-mainDarkRed" : ""
                }`}
              >
                Home
              </Link>
              <Link
                href={"/movies"}
                className={`font-semibold hover:text-mainDarkRed duration-300 ${
                  pathname === "/movies" ? "text-mainDarkRed" : ""
                }`}
              >
                Movies
              </Link>
              <Link
                href={"/tv-shows"}
                className={`font-semibold hover:text-mainDarkRed duration-300 ${
                  pathname === "/tv-shows" ? "text-mainDarkRed" : ""
                }`}
              >
                Tv Shows
              </Link>{" "}
              <Link
                href={"/people"}
                className={`font-semibold hover:text-mainDarkRed duration-300 ${
                  pathname === "/people" ? "text-mainDarkRed" : ""
                }`}
              >
                People
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handleSearchBtn();
              }}
              ref={searchBtnRef}
              type="link"
              className="bg-transparent p-2 text-2xl flex items-center justify-center text-white hover:text-mainDarkRed duration-300"
            >
              <AiOutlineSearch />
            </button>
            {session ? (
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
                className=" select-none"
                arrow
              >
                <a onClick={(e) => e.preventDefault()}>
                  <div className="w-10 cursor-pointer aspect-square rounded-full overflow-hidden relative">
                    <Image
                      fill
                      src={session?.user?.image}
                      className="object-cover object-center"
                      alt={session?.user?.username || "user"}
                    />
                  </div>
                </a>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push("/auth/login")}
                  type="link"
                  className="bg-mainLightRed text-white"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push("/auth/register")}
                  type="link"
                  className="bg-emerald-500 lg:flex hidden text-white"
                >
                  Sing up
                </Button>
              </div>
            )}

            <Button
              onClick={() => setMobilNavOpen(!mobilNavOpen)}
              type="button"
              className="bg-transparent text-2xl text-white lg:hidden relative"
            >
              <AiOutlineClose
                className={`${
                  mobilNavOpen ? "opacity-100" : " opacity-0"
                } duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
              />
              <GiHamburgerMenu
                className={`${
                  !mobilNavOpen ? "opacity-100" : " opacity-0 "
                } duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
              />
            </Button>
          </div>
        </div>
        <div
          className={`absolute left-0 top-full h-fit min-h-[44px] bg-white w-screen ${
            showSearch ? " " : "hidden"
          }`}
          ref={searchWrapperRef}
        >
          <div className="w-full border border-solid border-mainGray/30 border-x-0 border-t-0 ">
            <div className="container search-wrapper relative  ">
              <Input
                onChange={(e) => handleSearch(e)}
                type="input"
                value={searchQuery}
                ref={searchInputRef}
                onPressEnter={() => handlePressEnter()}
                placeholder="Search for a movie, tv show, person..."
                className="w-full rounded-none h-[44px] search-input !px-8 border-none focus:!shadow-none"
              />
              <Button
                className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black"
                type="link"
              >
                <AiOutlineSearch />
              </Button>{" "}
              <Button
                onClick={() => setShowSearch(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2  text-black hover:black"
                type="link"
              >
                <AiOutlineClose />
              </Button>
            </div>
          </div>

          {searchResult?.length !== 0 ? (
            <div className=" bg-white">
              <div className="flex flex-col gap-0 w-full">
                {searchResult.map((item, i) => {
                  if (item?.media_type === "movie") {
                    return (
                      <Link
                        key={i}
                        href={`/movie-details/${item?.id}-${item?.title
                          ?.toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="relative w-full px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 hover:bg-mainGray/20 duration-300"
                      >
                        <div className="container relative px-8">
                          <Button
                            className="line-clamp-1 w-full h-fit flex text-black "
                            key={i}
                            type="link"
                          >
                            {item?.title}
                          </Button>
                          <Button
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black"
                            type="link"
                          >
                            <MdLocalMovies />
                          </Button>
                        </div>
                      </Link>
                    );
                  } else if (item?.media_type === "tv") {
                    return (
                      <Link
                        key={i}
                        href={`/tv-details/${item?.id}-${item?.name
                          ?.toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="relative w-full px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 hover:bg-mainGray/20 duration-300"
                      >
                        <div className="container relative px-8 ">
                          <Button
                            className="line-clamp-1 w-full flex text-black   "
                            key={i}
                            type="link"
                          >
                            {item?.name}
                          </Button>
                          <Button
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black"
                            type="link"
                          >
                            <BsTv />
                          </Button>
                        </div>
                      </Link>
                    );
                  } else if (item?.media_type === "person") {
                    return (
                      <Link
                        key={i}
                        href={`/person/${item?.name
                          ?.toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="relative w-full px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 hover:bg-mainGray/20 duration-300"
                      >
                        <div className="container relative px-8  ">
                          <Button
                            className="line-clamp-1 w-full flex text-black "
                            key={i}
                            type="link"
                          >
                            {item?.name}
                          </Button>
                          <Button
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black"
                            type="link"
                          >
                            <BsFillPersonFill />
                          </Button>
                        </div>
                      </Link>
                    );
                  } else {
                    return null; // Return null for unsupported media types
                  }
                })}
              </div>
            </div>
          ) : searchQuery !== "" ? (
            <div className="relative w-full px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 ">
              <div className="container relative px-8 ">
                <div className="text-mainGray/30">
                  No results found please look for something else :(
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="h-[65px] w-full "></div>
    </div>
  );
};

export default Navbar;
