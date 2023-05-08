import React from "react";
import "./Card.scss";

const Card = ({ children, icon, text }) => {
  return (
    <div className="card">
      {icon}
      <h1>{text}</h1>
      {children}
    </div>
  );
};

export default Card;
