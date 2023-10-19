import React from "react";

const Title = ({ children }) => {
  return (
    <div className="py-5 font-semibold text-white text-3xl md:text-4xl">
      {children}
    </div>
  );
};

export default Title;
