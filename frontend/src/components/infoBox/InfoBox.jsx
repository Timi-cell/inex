import React from "react";
import "./InfoBox.scss";


const InfoBox = ({ title, value, color, icon }) => {
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className="info-box"
    >
      <div>{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>
          {`$${value}`}
        </p>
      </div>
    </div>
  );
};

export default InfoBox;
