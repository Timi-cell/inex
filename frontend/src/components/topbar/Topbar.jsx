import React from "react";
import "./Topbar.scss";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  SET_IS_OPEN,
  SET_LOGIN,
  SET_NAME,
  SET_USER,
  selectIsOpen,
} from "../../redux/features/auth/authSlice";
import { SET_ITEMS_INFO } from "../../redux/features/item/itemSlice";
import { logOutUser } from "../../services/authService";
import { HiMenuAlt3 } from "react-icons/hi";

const activeLink = ({ isActive }) => (isActive ? "active" : "");

const Links = ({ to, title }) => {
  return (
    <NavLink to={to} className={activeLink}>
      <div className="--rowFlex-left mobLinks">
        <span>{title}</span>
      </div>
    </NavLink>
  );
};

const user = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  createdAt: "",
};

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectIsOpen);
  const logOut = async () => {
    try {
      await logOutUser();
      dispatch(SET_LOGIN(false));
      dispatch(SET_NAME(""));
      dispatch(SET_USER(user));
      dispatch(SET_ITEMS_INFO());
      dispatch(SET_IS_OPEN(false));
      localStorage.removeItem("name");
      navigate("/login");
    } catch (error) {
      toast.error("Logout Unsuccessful!", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  const confirmLogOut = () => {
    confirmAlert({
      title: "LOGOUT",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => logOut(),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const showNavBar = () => {
    dispatch(SET_IS_OPEN(!isOpen));
  };
  return (
    <div className="topbar">
      <div className="head">
        <Link to="/">
          <h1 className="logo">InEx.</h1>
        </Link>
        <div className="icon">
          <HiMenuAlt3 size={40} onClick={showNavBar} />
        </div>
      </div>{" "}
      {/* className="topbar-content mob" */}
      <div className={`topbar-content mob ${isOpen ? "showMob" : ""}`}>
        <Links to="/dashboard" title="Dashboard" />
        <Links to="/profile" title="Profile" />
        {/* <Links to="/chart" title="Chart" /> */}
        <Links to="/report" title="Report Bug" />
        <button className="--btn --btn-primary" onClick={confirmLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
