import useWindowWidth from "@/hooks/useWindowWith";
import { Button, Collapse, Select, Slider, Tooltip, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const SideBar = ({
  page,
  sort,
  lang,
  genreList,
  targetRef,
  targetRef2,
  setGenreList,
  setLang,
  setSort,
  setPage,
  avarageVote,
  setAvarageVote,
  setMovies,
  setHideLoadBtn,
  isLoading,
  setIsLoading,
}) => {
  const width = useWindowWidth();
  const smallScreen = width <= 640;
  const [activeKey1, setActiveKey1] = useState(["99"]);
  const [activeKey2, setActiveKey2] = useState(["99"]);

  const movieGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];
  const handleAddGenreList = (id) => {
    if (genreList.find((i) => i.id === id)) {
      let list = genreList;
      const newList = list.filter((i) => i.id !== id);
      setGenreList(newList);
    } else {
      setGenreList([...genreList, { id: id }]);
    }
  };
  const marks = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
  };
  const handleFilterSearch = async () => {
    try {
      setIsLoading(true);
      setPage(1);

      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${
          process.env.NEXT_PUBLIC_TMDB_KEY
        }&page=${page}${sort ? `&sort_by=${sort}` : null}${
          genreList?.length !== 0
            ? `&with_genres=${genreList?.map((i) => `${i.id},`)}`
            : ""
        }${
          lang !== "all" && lang ? `&with_original_language=${lang}` : ""
        }&vote_average.gte=${avarageVote[0]}
            &vote_average.lte=${avarageVote[1]}`
      );

      // &vote_count.gte=${
      //   avarageVote[0]
      // }&vote_count.lte=${avarageVote[1]}
      setMovies(res?.data?.results);
      if (res?.data?.results?.length < 20) {
        setHideLoadBtn(true);
      } else {
        setHideLoadBtn(false);
      }
      window.scroll(0, 0);

      setActiveKey1(["99"]);
      setActiveKey2(["99"]);
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="filters w-full md:w-[23%] flex flex-col gap-3">
      <Collapse
        activeKey={activeKey1}
        onChange={(e) => setActiveKey1(e)}
        className="select-none bg-mainBlack2 border-none shadow-none "
        items={[
          {
            key: "1",
            label: "Sort",
            children: (
              <div className="flex flex-col gap-2">
                Sort Results By
                <Select
                  value={sort}
                  onChange={(e) => setSort(e)}
                  defaultValue="Popularity Descending"
                  options={[
                    {
                      value: "popularity.desc",
                      label: "Popularity Descending",
                    },
                    {
                      value: "popularity.asc",
                      label: "Popularity Ascending",
                    },
                    {
                      value: "vote_average.desc",
                      label: "Rating Descending",
                    },
                    {
                      value: "vote_average.asc",
                      label: "Rating Ascending",
                    },
                    {
                      value: "realse_date.desc",
                      label: "Release Date Descending",
                    },
                    {
                      value: "realse_date.asc",
                      label: "Release Date Ascending",
                    },
                    {
                      value: "original_title.asc",
                      label: "Title (A-Z)",
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />

      <Collapse
        className="select-none bg-mainBlack2 border-none shadow-none "
        activeKey={activeKey2}
        onChange={(e) => setActiveKey2(e)}
        items={[
          {
            key: "1",
            label: "Filters",
            children: (
              <div className="flex flex-col gap-2 relative">
                <div className="relative ">Genres</div>
                <div className="flex flex-wrap gap-3">
                  {movieGenres?.map((genre, i) => (
                    <Button
                      key={i}
                      type="button"
                      onClick={() => handleAddGenreList(genre?.id)}
                      className={`bg-transparent border border-white border-solid  sm:hover:bg-white sm:hover:text-blue-500 duration-300 w-fit group-checked:bg-red-300 ${
                        genreList?.find((item) => item.id == genre?.id)
                          ? " bg-white text-blue-500 "
                          : " bg-transparent text-white"
                      }`}
                      shape="round"
                    >
                      {genre?.name}
                    </Button>
                  ))}
                </div>
                <div
                  className="-ml-[16px] my-3 h-[1px] bg-white"
                  style={{ width: "calc(100% + 32px)" }}
                ></div>
                <div className="flex items-center gap-2">
                  Language{" "}
                  <Tooltip
                    color="#1f1d26"
                    className="text-center  !bg-mainBlack2"
                    title="Filter items based on their original language."
                  >
                    <AiOutlineQuestionCircle className="text-lg" />
                  </Tooltip>
                </div>
                <Select
                  value={lang || "all"}
                  onChange={(e) => setLang(e)}
                  defaultValue="all"
                  options={[
                    { value: "all", label: "All" },
                    { value: "zh", label: "Chinese" },
                    { value: "es", label: "Spanish" },
                    { value: "en", label: "English" },
                    { value: "hi", label: "Hindi" },
                    { value: "ar", label: "Arabic" },
                    { value: "bn", label: "Bengali" },
                    { value: "pt", label: "Portuguese" },
                    { value: "ru", label: "Russian" },
                    { value: "ja", label: "Japanese" },
                    { value: "pa", label: "Punjabi" },
                    { value: "mr", label: "Marathi" },
                    { value: "de", label: "German" },
                    { value: "jv", label: "Javanese" },
                    { value: "te", label: "Telugu" },
                    { value: "fr", label: "French" },
                    { value: "vi", label: "Vietnamese" },
                    { value: "ko", label: "Korean" },
                    { value: "ta", label: "Tamil" },
                    { value: "ur", label: "Urdu" },
                    { value: "it", label: "Italian" },
                    { value: "tr", label: "Turkish" },
                    { value: "th", label: "Thai" },
                    { value: "gu", label: "Gujarati" },
                    { value: "fa", label: "Persian" },
                    { value: "pl", label: "Polish" },
                    { value: "uk", label: "Ukrainian" },
                    { value: "ro", label: "Romanian" },
                    { value: "ms", label: "Malay" },
                    { value: "uz", label: "Uzbek" },
                  ]}
                />
                <div
                  className="-ml-[16px] my-3 h-[1px] bg-white"
                  style={{ width: "calc(100% + 32px)" }}
                ></div>
                <div className="relative ">User Score</div>
                <Slider
                  onChange={(e) => setAvarageVote([e[0], e[1]])}
                  marks={marks}
                  min={1}
                  max={10}
                  range
                  className="rate-range"
                  defaultValue={[0, 10]}
                  railStyle={{
                    background: "#8184A4",
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <Button
        onClick={handleFilterSearch}
        ref={targetRef}
        className={`bg-blue-400   text-xl p-5 rounded-full flex items-center justify-center font-semibold text-white duration-300 ${
          isLoading ? "" : "hover:bg-white hover:text-blue-400"
        }`}
        type="button"
        loading={isLoading}
      >
        Search
      </Button>
      <Button
        onClick={handleFilterSearch}
        ref={targetRef2}
        className={`hidden fixed z-40 left-0 bottom-0 w-full p-5 items-center justify-center font-semibold text-white bg-blue-400 gap-5 rounded-none duration-300 ${
          isLoading ? "" : "hover:bg-white hover:text-blue-400"
        }`}
        type="button"
        loading={isLoading}
      >
        Search
      </Button>
    </div>
  );
};

export default SideBar;
