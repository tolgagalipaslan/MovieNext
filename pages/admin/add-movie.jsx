import { Button, Divider, Form, Input, message } from "antd";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BsBookmarkPlus, BsFillPersonFill, BsTv } from "react-icons/bs";
import { MdLocalMovies, MdOutlineLogout } from "react-icons/md";
import translate from "translate";
const { TextArea } = Input;
const addMovie = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedResult, setSearchedResult] = useState({});
  const [form] = Form.useForm();
  const searchInputRef = useRef(null);
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
  const getTranslate = async (textToTranslate) => {
    try {
      const text = await translate(textToTranslate, "tr");
      form.setFieldsValue({
        overview: text,
      });
    } catch (error) {}
  };
  useEffect(() => {
    form.setFieldsValue({
      original_title: searchedResult?.movie?.original_title,
      search: searchedResult?.movie?.original_title,
      date: searchedResult?.movie?.release_date,
      poster_path:
        `https://www.themoviedb.org/t/p/w600_and_h900_bestv2` +
        searchedResult?.movie?.poster_path,
      vote: searchedResult?.movie?.vote_average,
      type: "Movie",
    });
    getTranslate(searchedResult?.movie?.overview);
    console.log(searchedResult);
  }, [searchedResult]);
  const movieDetailsPopulated = async (id) => {
    try {
      const populatedMovieRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
      );

      const castAndCrewRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
      );

      const videoRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
      );

      const data = {
        movie: populatedMovieRes?.data,
        cast: castAndCrewRes?.data,
        video: videoRes?.data?.results,
      };
      setSearchedResult(data);
    } catch (error) {
      // Hata yakalama işlemleri burada yapılabilir
      console.error("Hata oluştu: ", error);
    }
  };
  const onFinish = async (values) => {
    try {
      const res = await axios.post(`/api/movie/create`, {
        movieData: searchedResult,
        movieOverview: values.overview,
        movieId: searchedResult.movie.id,
        movieURL: values.video_path,
      });
      //form.resetFields();
      message.success(`Basarili`);
    } catch (error) {
      message.error("olmadi");
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">Add Movie</h1>
      <Divider className=" pb-4" />
      <Form form={form} layout="vertical" name="basic" onFinish={onFinish}>
        <div className="flex lg:flex-row flex-col w-full justify-between gap-3  ">
          <div className="lg:w-8/12  w-full flex flex-col">
            <div className="w-full  relative">
              <Form.Item name="search">
                <Input
                  onChange={(e) => handleSearch(e)}
                  type="input"
                  value={searchQuery}
                  ref={searchInputRef}
                  size="large"
                  placeholder="Search for a movie ..."
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
              {searchResult?.length !== 0 ? (
                <div className=" bg-white border absolute z-40  border-gray-100 shadow-md rounded-md  w-full -mt-5">
                  <div className="flex flex-col gap-0 w-full ">
                    {searchResult.map((item, i) => {
                      if (item?.media_type === "movie") {
                        return (
                          <div
                            key={i}
                            onClick={(e) => {
                              movieDetailsPopulated(item.id);
                              setSearchQuery("");
                              setSearchResult([]);
                            }}
                            className="relative w-full  flex items-center h-[90px] px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 hover:bg-mainGray/20 duration-300"
                          >
                            <div className="container relative px-14   ">
                              <Button
                                className="line-clamp-1 w-full h-fit flex text-black   justify-items-start gap-1"
                                key={i}
                                type="link"
                              >
                                {item?.title + " "}{" "}
                                <span className="font-bold text-sm ">
                                  ({item?.release_date.slice(0, 4)})
                                </span>
                              </Button>
                              <div className="absolute w-[50px] left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black aspect-[4/6] ">
                                <Image
                                  fill
                                  className="object-cover object-center   rounded-md"
                                  src={`${
                                    item?.poster_path
                                      ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${item?.poster_path}`
                                      : "/assets/default-img.png"
                                  }`}
                                  alt={
                                    item?.original_title || " default-img.png"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }
                      //else if (item?.media_type === "tv") {
                      //   return (
                      //     <div
                      //       key={i}
                      //       href={`/tv-details/${item?.id}-${item?.name
                      //         ?.toLowerCase()
                      //         .replace(/ /g, "-")}`}
                      //       className="relative w-full px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 hover:bg-mainGray/20 duration-300"
                      //     >
                      //       <div className="container relative px-8 ">
                      //         <Button
                      //           className="line-clamp-1 w-full flex text-black   "
                      //           key={i}
                      //           type="link"
                      //         >
                      //           {item?.name}
                      //         </Button>
                      //         <Button
                      //           className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black"
                      //           type="link"
                      //         >
                      //           <BsTv />
                      //         </Button>
                      //       </div>
                      //     </div>
                      //   );
                      // }
                      else {
                        return null; // Return null for unsupported media types
                      }
                    })}
                  </div>
                </div>
              ) : searchQuery !== "" ? (
                <div className="w-full  absolute px-8  z-40  border border-solid border-mainGray/30 border-x-0 border-t-0 ">
                  <div className="container relative px-8 ">
                    <div className="text-mainGray/30">
                      No results found please look for something else :(
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex w-full  gap-2 ">
              <Form.Item name="original_title" label="Title:" className="w-2/3">
                <Input
                  type="input"
                  size="large"
                  disabled
                  placeholder="Original Title"
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
              <Form.Item name="date" label="Date:" className="w-1/3">
                <Input
                  type="input"
                  disabled
                  size="large"
                  placeholder="Release Date"
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
            </div>
            <div className="flex w-full  gap-2 ">
              <Form.Item name="poster_path" label="Poster:" className="w-4/5">
                <Input
                  type="input"
                  size="large"
                  disabled
                  placeholder="Poster Path"
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
              <Form.Item name="vote" label="Avg. Vote:" className="w-1/5">
                <Input
                  type="input"
                  disabled
                  size="large"
                  placeholder="Vote Average"
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
            </div>
            <Form.Item name="overview" label="Overview:">
              <TextArea rows={4} placeholder="Overview..." disabled />
            </Form.Item>

            <div className="flex w-full  gap-2 ">
              <Form.Item name="video_path" label="Video URL:" className="w-4/5">
                <Input
                  type="input"
                  size="large"
                  placeholder="Video Url Path"
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
              <Form.Item name="type" label="Type:" className="w-1/5">
                <Input
                  type="input"
                  disabled
                  size="large"
                  placeholder="Movie or Series..."
                  className="w-full   search-input   focus:!shadow-none"
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="bg-blue-500 w-full hover:bg-blue-400 duration-300"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
          <div className="max-w-3/12    relative   lg:flex  hidden ">
            {" "}
            <div className="relative mx-auto   xl:w-[370px] lg:w-[280px]  md:w-[350px] md:aspect-[4/6]  md:min-w-[300px] ">
              <Image
                fill
                className="object-cover object-center    rounded-md"
                src={`${
                  searchedResult?.movie?.poster_path
                    ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${searchedResult?.movie?.poster_path}`
                    : "/assets/default-img.png"
                }`}
                alt={searchedResult?.movie?.original_title || "default-img.png"}
              />{" "}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default addMovie;
