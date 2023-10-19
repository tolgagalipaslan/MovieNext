import React, { useEffect, useState } from "react";

const Loading = ({ loading }) => {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setHide(true);
      }, [2000]);
    }
  }, [loading]);
  return (
    <div
      className={`fixed z-[999] top-0 left-0 w-full h-screen bg-mainBlack flex items-center justify-center duration-[2000ms] ${
        loading ? "opacity-100" : "opacity-0"
      } ${hide ? "hidden" : ""}`}
    >
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
