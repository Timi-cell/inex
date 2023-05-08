import React from "react";
import loaderImage from "../../assets/gifs/arrows.gif";
import pageLoaderImage from "../../assets/gifs/dollar.gif";
import ReactDOM from "react-dom";
import "./Loader.scss";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={pageLoaderImage} alt="Loading..." />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const SpinnerImg = () => {
  return (
    <div className="center">
      <img src={loaderImage} alt="Loading..." />
    </div>
  );
};
export default Loader;
