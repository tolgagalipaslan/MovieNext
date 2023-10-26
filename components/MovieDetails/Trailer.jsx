// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import Title from "../ui/Title";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, Tooltip, message } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { Tabs, ConfigProvider } from "antd";
import { BsExclamationLg } from "react-icons/bs";
import { useSession } from "next-auth/react";
import axios from "axios";
const { TextArea } = Input;
const Trailer = ({ video, cast, id }) => {
  const [nextBtn, setNextBtn] = useState(null);
  const [prevBtn, setPrevBtn] = useState(null);
  const [isloaded, setIsloaded] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState("prev");
  const [selectedVideo, setSelectedVideo] = useState(0);
  const user = useSession();
  const swiperRef = useRef(null);
  const swiper = useSwiper();
  const handleGoToSlide = (index) => {
    swiperRef.current.swiper.slideTo(index);

    if (swiperRef.current.swiper.isBeginning) {
      setDisabledBtn("prev");
    } else if (swiperRef.current.swiper.isEnd) {
      setDisabledBtn("next");
    } else {
      setDisabledBtn("");
    }
  };

  useEffect(() => {
    const prevButton = document.querySelector(
      ".trailer-swiper .swiper-button-prev"
    );

    setNextBtn(prevButton);
    const nextButton = document.querySelector(
      ".trailer-swiper .swiper-button-next"
    );
    setPrevBtn(nextButton);
  }, []);
  const items = [
    {
      key: "1",
      label: "Fragman",
      children: (
        <div className=" flex md:flex-row flex-col h-full " id="videoContainer">
          {video[0]?.key && (
            <iframe
              className="w-full md:w-2/3 aspect-video"
              src={`https://www.youtube.com/embed/${video[selectedVideo].key}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )}
          <div className="w-full md:w-1/3 aspect-video py-3 bg-mainBlack2">
            <div className="md:h-[10%] flex items-center justify-center ">
              {" "}
              <div
                className={`text-white text-3xl   duration-300 ${
                  disabledBtn === "prev"
                    ? "!text-mainBlack"
                    : "cursor-pointer hover:text-mainDarkRed"
                } `}
                onClick={() => nextBtn.click()}
                type="button"
              >
                <AiOutlineUp />
              </div>
            </div>
            <Swiper
              onSlideChange={() => {
                if (swiperRef.current.swiper.isBeginning) {
                  setDisabledBtn("prev");
                } else if (swiperRef.current.swiper.isEnd) {
                  setDisabledBtn("next");
                } else {
                  setDisabledBtn("");
                }
              }}
              slidesPerView={1}
              spaceBetween={10}
              ref={swiperRef}
              breakpoints={{
                0: {
                  slidesPerView: 5,
                  spaceBetween: 0,
                },
                550: {
                  slidesPerView: 5,
                  spaceBetween: 0,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 0,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 0,
                },
              }}
              navigation={true}
              modules={[Navigation]}
              direction={"vertical"}
              className="trailer-swiper  w-full h-[400px] md:h-[80%] "
            >
              {video?.map((item, i) => (
                <SwiperSlide
                  onClick={() => {
                    setSelectedVideo(i);
                    handleGoToSlide(i);
                  }}
                  key={i}
                  className="relative "
                >
                  <div
                    key={i}
                    className={`flex  gap-3 h-full hover:bg-mainGray/30 cursor-pointer p-3 ${
                      selectedVideo === i ? "bg-mainGray/30" : ""
                    }`}
                  >
                    <div className="relative w-[100px] min-w-[100px] aspect-video ">
                      <Image
                        className="object-contain "
                        fill
                        src={`https://img.youtube.com/vi/${video[i]?.key}/maxresdefault.jpg`}
                        alt={video[i]?.name}
                      />
                    </div>
                    <div className="flex flex-col w-full text-white">
                      <div className="font-semibold line-clamp-1">
                        {item?.name}
                      </div>
                      <div className="text-sm text-mainGray/50">
                        {item?.type}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="md:h-[10%] flex items-center justify-center">
              {" "}
              <div
                className={`text-white text-3xl   duration-300 ${
                  disabledBtn === "next"
                    ? "!text-mainBlack"
                    : "cursor-pointer hover:text-mainDarkRed"
                } `}
                onClick={() => prevBtn.click()}
                type="button"
              >
                <AiOutlineDown />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "VidMoly",
      children: (
        <iframe
          className="mx-auto w-full aspect-video"
          src="//vidmoly.to/embed-qe7shgrt2y5k.html"
          scrolling="no"
          frameBorder="0"
          width="940"
          height="480"
          allowFullScreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
        ></iframe>
      ),
    },
  ];
  const handleCancel = () => {
    setIsloaded(false);
  };
  const onFinish = async (values) => {
    try {
      const res = await axios.post(`/api/report`, {
        user: values.username,
        report_title: values.title,
        report_description: values.content,
        report_movie: id,
      });
      //form.resetFields();
      message.success(`Rapor başarıyla gönderildi!`);
      setIsloaded(false);
    } catch (error) {
      message.error("Rapor gönderilirken bir hata oluştu!");
      console.log(error);
    }
  };
  return (
    <div id="trailer-wrapper">
      {video?.length !== 0 ? (
        <>
          <div className="container">
            <Title>Trailers & Featurette</Title>
          </div>
          <div className="relative container !px-0">
            <ConfigProvider
              className="relative"
              theme={{
                token: {
                  colorPrimaryBorder: "#ffc107",
                  colorBorderSecondary: "#ffc107",
                  colorBgContainer: "#ffc107",
                  colorPrimary: "#000",
                  margin: 0,
                },
                components: {
                  Tabs: {
                    cardBg: `#fff`,
                    cardGutter: 3,
                    colorBorder: "#00b96b",
                  },
                },
              }}
            >
              <Tabs
                className="container  "
                type="card"
                style={{ cardHeight: 10 }}
                defaultActiveKey="1"
                items={items}
              />
            </ConfigProvider>
            <div
              className="w-[40px] h-[40px] bg-[#ffc107] right-3 absolute top-0 rounded-t-md "
              onClick={(e) => {
                setIsloaded(true);
              }}
            >
              <Tooltip placement="top" title={"Rapor Gonder"}>
                <div className="w-full h-full">
                  <BsExclamationLg className="w-full h-full items-center cursor-pointer justify-center flex  text-mainBlack hover:scale-75 duration-500" />
                </div>
              </Tooltip>
            </div>
          </div>
        </>
      ) : null}
      <div>
        <Modal
          bodyStyle={{
            padding: 0,
            backgroundColor: "",
          }}
          className="text-white comment-report-modal"
          centered
          footer={null}
          open={isloaded}
          onCancel={handleCancel}
        >
          <Form
            name="wrap"
            layout="vertical"
            className="text-white"
            labelAlign="left"
            labelWrap
            wrapperCol={{
              flex: 1,
            }}
            colon={false}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              label={<div className="text-white">Kullanıcı Adı:</div>}
              name="username"
              className="text-white"
              initialValue={user?.data?.user?.username}
              rules={[
                {
                  required: true,
                  message: "Kullanıcı adınızı giriniz!",
                },
              ]}
            >
              <Input defaultValue={user?.data?.user?.username} size="large" />
            </Form.Item>
            <Form.Item
              label={<div className="text-white">Konu:</div>}
              name="title"
              className="text-white"
              rules={[
                {
                  required: true,
                  message: "Raporun bir konusu olmalı!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={<div className="text-white">İçerik:</div>}
              name="content"
              rules={[
                {
                  required: true,
                  message: "Raporun bir içeriği olmalı!",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Overview..." />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 duration-500 hover:scale-105"
              >
                Raporu Gönder
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Trailer;
