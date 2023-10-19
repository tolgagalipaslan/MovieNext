import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useSession } from "next-auth/react";
import { setData } from "@/redux/features/watchList";
import { setDataFav } from "@/redux/features/favorites";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      handleSetWatchList();
      handleSetFavorites();
    }
  }, [session]);

  const handleSetWatchList = async () => {
    try {
      const res = await axios.get(
        `/api/watchList?queryId=${session?.user?.id}`
      );
      dispatch(setData(res?.data?.watchList));
    } catch (error) {
      console.log(error);
    }
  };
  const handleSetFavorites = async () => {
    try {
      const res = await axios.get(
        `/api/favoriteList?queryId=${session?.user?.id}`
      );

      dispatch(setDataFav(res?.data?.favoriteList));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
