import { Button, Divider, Space, Table, Tag, message } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
const index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [movie_res, setMovie_res] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "loading",
      content: `
      The transaction is being processed, please wait!`,
      duration: 0,
    });
  };
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const getAllMovie = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.get(`/api/movie`);
      setMovie_res(res.data);
      console.log(res.data);
      var genreData = res.data.reduce(function (acc, item) {
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
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <button
          type="button"
          onClick={clearFilters}
          style={{ width: 90, marginRight: 8 }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            confirm();
          }}
          style={{ width: 90 }}
        >
          Filter
        </button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      // dataIndex, "movie_data.movie.original_title" olacak
      const originalTitle = record.movie_data.movie.original_title;
      return originalTitle
        ? originalTitle.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
  });

  const columns = [
    {
      title: `Poster`,
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (_, { movie_data }) => {
        return (
          <div className="relative h-[110px] w-[110px] rounded-lg overflow-hidden">
            <Image
              fill
              sizes="(max-width: 110px) (max-width: 110pxx) "
              src={
                `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/` +
                movie_data.movie.poster_path
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
      ...getColumnSearchProps("Title"),
      render: (_, { movie_data }) => (
        <div className="table-course-title ">
          {movie_data?.movie?.original_title}
        </div>
      ),
    },
    {
      title: <div className="">Overview</div>,
      dataIndex: "description",
      key: "description",
      // responsive: isSmallScreen ? ["lg"] : undefined,
      render: (_, { movie_overview }) => (
        <div className="table-course-title line-clamp-2">{movie_overview}</div>
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
        const genreIds = record.movie_data?.movie?.genres.map(
          (genre) => genre.id
        );
        // value (seçilen filtre) bir kayıt içindeki genre id'leri arasında var mı kontrol et
        return genreIds.includes(value);
      },

      render: (_, { movie_data }) => (
        <span>
          {movie_data?.movie?.genres.map((genre) => (
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
      width: "25%",
      render: (_, action) => (
        <div className="flex gap-2 w-fit">
          <Space size="middle" className=" ">
            <Button
              type="primary"
              loading={deleteLoading}
              disabled={deleteLoading}
              className="w-fit bg-blue-500 hover:bg-blue-400  duration-300"
              icon={<EditOutlined />}
              onClick={() => {
                router.push(`/admin`);
              }}
            >
              Edit
            </Button>
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
  const deleteMovie = async (id) => {
    try {
      setDeleteLoading(true);
      success();
      const res = await axios.post(`/api/movie`, {
        id: id,
      });
      getAllMovie();
      messageApi.destroy();
      message.success("The transaction was completed successfully");
      setDeleteLoading(false);
    } catch (error) {
      console.log(error);
      messageApi.destroy();
      message.error(`An error occurred during the operation`);
      setDeleteLoading(false);
    }
  };
  return (
    <div className="">
      <div className="flex justify-between gap-3 items-center">
        <h1 className=" text-xl md:text-2xl font-bold text-black">
          {" "}
          All Movies
        </h1>
      </div>
      <Divider className=" pb-4" />

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

export default index;
