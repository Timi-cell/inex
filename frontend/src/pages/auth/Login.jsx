import React, { useState } from "react";
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {  useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { loginUser, validateEmail } from "../../services/authService";
import Loader from "../../components/loader/Loader";
import { getItems } from "../../redux/features/item/itemSlice";
const icon = <BiLogIn color="var(--grey)" size={45} />;
const eye = <AiFillEye size={25} color="#eee" />;
const eyeHide = <AiFillEyeInvisible size={25} color="#eee" />;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialState = {
    email: "",
    password: "",
  };
  // let { userCurrency } = useSelector((state) => state.item);
  // let { items } = useSelector((state) => state.item);
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { email, password } = formData;
  // Toggle Password Type
  const [type1, setType1] = useState("password");
  const toggleType1 = () => {
    type1 === "password" ? setType1("text") : setType1("password");
  };

  const showIcon1 = () => {
    if (type1 === "password") {
      return eye;
    } else {
      return eyeHide;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    const userData = {
      email,
      password,
    };
    setIsLoading(true);
    try {
      const data = await loginUser(userData);
      if (data) {
        dispatch(SET_LOGIN(true));
        dispatch(SET_NAME(data.name));
        dispatch(getItems());
        // dispatch(SET_CURRENCY(userCurrency));
        // if (items.length > 0) {
        //   console.log(items[0].currency);
        //   dispatch(SET_CURRENCY(items[0].currency));
        // } else {
        //   dispatch(SET_CURRENCY(""));
        // }
        navigate("/dashboard");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Invalid email or password!", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  return (
    <Card
      icon={icon}
      text="Login"
      children={loginForm(
        type1,
        toggleType1,
        showIcon1,
        handleChange,
        handleSubmit,
        isLoading
      )}
    />
  );
};

const loginForm = (
  type1,
  toggleType1,
  showIcon1,
  handleChange,
  handleSubmit,
  isLoading
) => {
  return (
    <div>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          name="email"
          onChange={handleChange}
        />
        <div className="password">
          <input
            type={type1}
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />
          <span onClick={toggleType1}>{showIcon1()}</span>
        </div>
        <Link to="/forgotpassword">
          <p id="forgot">Forgot Password?</p>
        </Link>
        <button type="submit" className="--btn --btn-primary">
          Login
        </button>
      </form>
      <span>
        <Link to="/">
          <p className="blueText">Home</p>
        </Link>
        <p>&nbsp;Don't have an account? &rarr;</p>
        <Link to="/register">
          <p className="blueText">Register</p>
        </Link>
      </span>
    </div>
  );
};

export default Login;
