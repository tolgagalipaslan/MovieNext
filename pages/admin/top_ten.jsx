import { Button, Input, Space, Table, Tag, message } from "antd";
import axios from "axios";
import Image from "next/image";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
const Top_ten = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedResult, setSearchedResult] = useState({});
  const [movie_res, setMovie_res] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const searchInput = useRef(null);
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
        `/api/top_ten/search?query=${e.target.value}`
      );

      setSearchResult(res?.data);
      console.log(res?.data);
    }
  };
  const movieDetailsPopulated = async (id) => {
    try {
      setDeleteLoading(true);
      const populatedMovieRes = await axios.post(`/api/top_ten/search`, { id });
      message.success("Film Top 10'a kaydedildi!");
      //setSearchedResult(data);
      getAllMovie();
      setDeleteLoading(false);
    } catch (error) {
      // Hata yakalama işlemleri burada yapılabilir
      message.error("Bu film zaten top 10 da!");
      setDeleteLoading(false);

      console.error("Hata oluştu: ", error);
    }
  };
  const getAllMovie = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.get(`/api/top_ten`);
      setMovie_res(res.data);
      console.log(res.data);
      var genreData = res.data.top_movie.reduce(function (acc, item) {
        // Her "movie" içindeki "genres" dizisini birleştir
        var movieGenres = item.movie_data.movie.genres;
        // "genre" verilerini ana diziye ekleyin
        acc = acc.concat(movieGenres);
        return acc;
      }, []);
      var uniqueGenreData = genreData.filter((value, index, self) => {
        return (
          // "id" ve "name" değeri aynı olan öğeleri kontrol et
          self.findIndex(
            (item) => item.id === value.id && item.name === value.name
          ) === index
        );
      });

      setGenreData(uniqueGenreData);
      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getAllMovie();
  }, []);
  const columns = [
    {
      title: `Poster`,
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (_, { top_movie }) => {
        return (
          <div className="relative h-[110px] w-[110px] rounded-lg overflow-hidden">
            <Image
              fill
              sizes="(max-width: 110px) (max-width: 110pxx) "
              src={
                `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/` +
                top_movie.movie_data.movie.poster_path
              }
              alt="admin"
              className="object-cover"
            />
          </div>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Title</div>,
      dataIndex: "productTitle",
      key: "productTitle",
      render: (_, { top_movie }) => (
        <div className="table-course-title ">
          {top_movie.movie_data?.movie?.original_title}
        </div>
      ),
    },
    {
      title: <div className="">Overview</div>,
      dataIndex: "description",
      key: "description",
      // responsive: isSmallScreen ? ["lg"] : undefined,
      render: (_, { top_movie }) => (
        <div className="table-course-title line-clamp-2">
          {top_movie.movie_overview}
        </div>
      ),
    },
    {
      title: `Category`,
      dataIndex: "category",
      filters: genreData?.map((genreData) => ({
        text: genreData?.name,
        value: genreData?.id,
      })),

      key: "category",
      onFilter: (value, record) => {
        // Kayıt içindeki tüm genre id'lerini al
        const genreIds = record.top_movie.movie_data?.movie?.genres.map(
          (genre) => genre.id
        );
        // value (seçilen filtre) bir kayıt içindeki genre id'leri arasında var mı kontrol et
        return genreIds.includes(value);
      },

      render: (_, { top_movie }) => (
        <span>
          {top_movie.movie_data?.movie?.genres.map((genre) => (
            <Tag color={"blue"} className="" key={genre?.id}>
              {genre?.name}
            </Tag>
          ))}
        </span>
      ),
    },

    {
      title: `Date`,
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "10%",
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
      sortOrder: sortedInfo.columnKey === "updatedAt" ? sortedInfo.order : null,
      ellipsis: true,
      // responsive: isSmallScreen ? ["lg"] : undefined,
      render: (_, { updatedAt }) => (
        <div className="table-course-title ">{updatedAt?.slice(0, 10)}</div>
      ),
    },

    {
      title: `Transactions`,
      key: "action",
      render: (_, action) => (
        <div className="flex gap-2 w-fit">
          <Space size="middle" className=" ">
            <Button
              type="primary"
              loading={deleteLoading}
              disabled={deleteLoading}
              danger
              className="w-full"
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteMovie(action._id);
                // setAreYouSure(true);
              }}
            >
              Delete
            </Button>
          </Space>
        </div>
      ),
    },
  ];
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="w-full relative ">
      <Input
        onChange={(e) => handleSearch(e)}
        type="input"
        value={searchQuery}
        ref={searchInputRef}
        size="large"
        placeholder="Search for a movie ..."
        className="w-1/2  search-input   focus:!shadow-none"
      />
      {searchResult?.length !== 0 ? (
        <div className=" bg-white border absolute z-40  border-gray-100 shadow-md rounded-md  w-1/2  ">
          <div className="flex flex-col gap-0   ">
            {searchResult.map((item, i) => {
              if (item?.movie_data?.movie) {
                return (
                  <div
                    key={i}
                    onClick={(e) => {
                      movieDetailsPopulated(item._id);
                      setSearchQuery("");
                      setSearchResult([]);
                    }}
                    className="relative w-full  flex items-center justify-start h-[90px] px-8 border border-solid border-mainGray/30 border-x-0 border-t-0 hover:bg-mainGray/20 duration-300"
                  >
                    <div className="container relative px-14   ">
                      <Button
                        className="line-clamp-1 w-full h-fit flex text-black   justify-items-start gap-1"
                        key={i}
                        type="link"
                      >
                        {item?.movie_data?.movie?.original_title + " "}{" "}
                        <span className="font-bold text-sm ">
                          ({item?.movie_data?.movie?.release_date.slice(0, 4)})
                        </span>
                      </Button>
                      <div className="absolute w-[50px] left-0 top-1/2 -translate-y-1/2 text-xl text-black hover:black aspect-[4/6] ">
                        <Image
                          fill
                          className="object-cover object-center   rounded-md"
                          src={`${
                            item?.movie_data?.movie?.poster_path
                              ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${item?.movie_data?.movie.poster_path}`
                              : "/assets/default-img.png"
                          }`}
                          alt={
                            item?.movie_data?.movie.original_title ||
                            " default-img.png"
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
        <div className="  absolute px-8  z-40  border border-solid border-mainGray/30 border-x-0 border-t-0 w-1/2">
          <div className="container relative px-8 ">
            <div className="text-mainGray/30">
              No results found please look for something else :(
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex  flex-col gap-4  overflow-x-auto">
        {/* {isLoading ? (
      <Table dataSource={data} columns={skeletonColums} />
    ) : ( */}
        <Table
          columns={columns}
          dataSource={movie_res}
          loading={deleteLoading}
          className="w-full  "
          scroll={{ x: 1360 }}
          rowKey={(record) => record?._id}
          pagination={{
            current: currentPage, // Şu anki sayfa numarası
            pageSize: 10, // Her sayfada görüntülenecek veri sayısı
            onChange: onPageChange,
          }}
        />
      </div>
    </div>
  );
};

export default Top_ten;
