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
import { useRouter } from "next/router";
const Reports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [movie_res, setMovie_res] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const router = useRouter();
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
      const res = await axios.get(`/api/report`);
      setMovie_res(res.data);
      console.log(res.data);
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
      title: <div className="">User Name</div>,
      dataIndex: "username",
      key: "username",
      // responsive: isSmallScreen ? ["lg"] : undefined,
      render: (_, { user }) => (
        <div className="table-course-title line-clamp-2">{user}</div>
      ),
    },
    {
      title: <div className="whitespace-nowrap">Topic</div>,
      dataIndex: "reportTitle",
      key: "reportTitle",
      render: (_, { report_title }) => (
        <div className="table-course-title ">{report_title}</div>
      ),
    },
    {
      title: <div className="">Content</div>,
      dataIndex: "description",
      key: "description",
      // responsive: isSmallScreen ? ["lg"] : undefined,
      render: (_, { report_description }) => (
        <div className="table-course-title line-clamp-2">
          {report_description}
        </div>
      ),
    },
    {
      title: <div className="">Reported Movie</div>,
      dataIndex: "movie",
      key: "movie",
      // responsive: isSmallScreen ? ["lg"] : undefined,
      render: (_, { report_movie }) => (
        <div className="table-course-title line-clamp-2">
          {report_movie?.movie_data?.movie?.original_title}
        </div>
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

export default Reports;
