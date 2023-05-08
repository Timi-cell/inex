import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";

const ShowOnLogIn = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return <div>{children}</div>;
  }
};

export const ShowOnLogOut = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <div>{children}</div>;
  }
};

export default ShowOnLogIn;
