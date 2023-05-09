import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  changePassword,
  deleteUser,
  getUser,
} from "../../services/authService";
import {
  SET_IS_OPEN,
  SET_LOGIN,
  SET_NAME,
  SET_USER,
  selectUser,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { SET_ITEMS_INFO } from "../../redux/features/item/itemSlice";

const eye = <AiFillEye size={25} color="#eee" />;
const eyeHide = <AiFillEyeInvisible size={25} color="#eee" />;
const initialState = {
  password: "",
  password2: "",
  password3: "",
};
const userInitialInfo = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  createdAt: "",
};
const Profile = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Toggle Password Type
  const [type1, setType1] = useState("password");
  const [type2, setType2] = useState("password");
  const [type3, setType3] = useState("password");
  const [data, setData] = useState(initialState);
  const { password, password2, password3 } = data;
  const [isLoading, setIsLoading] = useState(false);
  const promptMsg = (
    <div className="--mt1">
      Hello, {user.name}, Are you sure you want to delete your account?{" "}
      <p className="--mt1"> This action is irreversible!</p>
      <p className="--mt1">
        {" "}
        Click YES to continue Account Deletion, Click NO to Exit
      </p>
      <p className="--mt1">
        {" "}
        Click REPORT BUG to report an issue to us instead.
      </p>
    </div>
  );
  const toggleType1 = () => {
    type1 === "password" ? setType1("text") : setType1("password");
  };
  const toggleType2 = () => {
    type2 === "password" ? setType2("text") : setType2("password");
  };
  const toggleType3 = () => {
    type3 === "password" ? setType3("text") : setType3("password");
  };

  const showIcon1 = () => {
    if (type1 === "password") {
      return eye;
    } else {
      return eyeHide;
    }
  };

  const showIcon2 = () => {
    if (type2 === "password") {
      return eye;
    } else {
      return eyeHide;
    }
  };
  const showIcon3 = () => {
    if (type3 === "password") {
      return eye;
    } else {
      return eyeHide;
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !password2 || !password3) {
      toast.error("Please fill in all required fields!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    if (password.length < 6 || password2.length < 6 || password3.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    if (password2 !== password3) {
      toast.error("Passwords do not match!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    try {
      const data = { password, password2 };
      await changePassword(data);
      setData(initialState);
    } catch (error) {
      toast.error("Password could not be updated!", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  const handleDelete = async () => {
    const data = await deleteUser();
    if (data.success) {
      dispatch(SET_LOGIN(false));
      dispatch(SET_NAME(""));
      dispatch(SET_USER(userInitialInfo));
      dispatch(SET_ITEMS_INFO());
      dispatch(SET_IS_OPEN(false));
      localStorage.removeItem("name");
      toast.success(data.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      navigate("/register");
    } else {
      toast.error(data.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  const gotoReportPage = () => {
    setIsLoading(true);
    navigate("/report");
    setIsLoading(false);
  };
  const confirmDelete = (message) => {
    confirmAlert({
      title: "ACCOUNT DELETION!",
      message: message,
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(),
        },
        {
          label: "No",
        },
        {
          label: "Report Bug",
          onClick: () => gotoReportPage(),
        },
      ],
    });
  };

  useEffect(() => {
    async function getTheUser() {
      setIsLoading(true);
      const data = await getUser();
      dispatch(SET_USER(data));
      dispatch(SET_IS_OPEN(false));
      setIsLoading(false);
    }

    getTheUser();
  }, [dispatch]);
  return (
    <div className="profile">
      {isLoading && <Loader />}
      <h2>Profile</h2>
      <div className="profile-content --mt1">
        <img src={user.photo} alt="profilePic" />
        <div className="info">
          <div>
            <h4>Name</h4> <span>{user.name}</span>
          </div>
          <div>
            <h4>Email</h4> <span>{user.email}</span>
          </div>
          <div>
            <h4>Phone</h4> <span>{user.phone}</span>
          </div>
          <div>
            <h4>Joined InEx On</h4>
            <span>
              {new Date(user.createdAt).toLocaleDateString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="buttons">
            <Link to="/editprofile">
              <button className="--btn --btn-primary">Edit Profile</button>
            </Link>
            <button
              className="--btn --btn-danger"
              onClick={() => confirmDelete(promptMsg)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <div className="changepass --mt1">
        <h4>Change Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="password">
            <input
              type={type1}
              placeholder="Old Password"
              name="password"
              required
              onChange={handleChange}
              value={password}
            />
            <span onClick={toggleType1}>{showIcon1()}</span>
          </div>
          <div className="password">
            <input
              type={type2}
              placeholder="New Password"
              name="password2"
              required
              onChange={handleChange}
              value={password2}
            />
            <span onClick={toggleType2}>{showIcon2()}</span>
          </div>
          <div className="password">
            <input
              type={type3}
              placeholder="Confirm New Password"
              name="password3"
              required
              onChange={handleChange}
              value={password3}
            />
            <span onClick={toggleType3}>{showIcon3()}</span>
          </div>
          <button className="--btn --btn-primary --mt1">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
