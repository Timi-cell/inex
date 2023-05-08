import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import ShowOnLogIn, { ShowOnLogOut } from "../hiddenLinks/HiddenLinks";

const Header = () => {
  return (
    <div className="header">
      <h1 className="logo">
        <Link to="/">InEx.</Link>
      </h1>
      <ul className="content">
        <ShowOnLogOut>
          <li className="link">
            <Link to="/register">Register</Link>
          </li>
        </ShowOnLogOut>
        <ShowOnLogOut>
          <li className="link blue-link">
            <Link to="/login">Login</Link>
          </li>
        </ShowOnLogOut>
        <ShowOnLogIn>
          <li className="link blue-link">
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ShowOnLogIn>
      </ul>
    </div>
  );
};

export default Header;
