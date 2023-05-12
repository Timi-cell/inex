import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./components/layout/Layout";
import Profile from "./pages/profile/Profile";
// import Chart from "./pages/chart/Chart";
import Report from "./pages/report/Report";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import { getLoginStatus } from "./services/authService";
import EditProfile from "./pages/profile/EditProfile";
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status));
    }
    loginStatus();
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<Forgot />} />
          <Route path="/resetpassword/:resetToken" element={<Reset />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/editprofile"
            element={
              <Layout>
                <EditProfile />
              </Layout>
            }
          />
          {/* <Route
            path="/chart"
            element={
              <Layout>
                <Chart />
              </Layout>
            }
          /> */}
          <Route
            path="/report"
            element={
              <Layout>
                <Report />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
