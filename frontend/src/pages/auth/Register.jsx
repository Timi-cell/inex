import React, { useState } from "react";
import Card from "../../components/card/Card";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import { SET_CURRENCY } from "../../redux/features/item/itemSlice";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import Loader from "../../components/loader/Loader";

const icon = <AiOutlineUserAdd color="var(--grey)" size={45} />;
const eye = <AiFillEye size={25} color="#eee" />;
const eyeHide = <AiFillEyeInvisible size={25} color="#eee" />;

const Register = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    password2: "",
  };
  // let {  userCurrency } = useSelector((state) => state.item);

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email, password, password2 } = formData;
  // Toggle Password Type
  const [type1, setType1] = useState("password");
  const [type2, setType2] = useState("password");
  const toggleType1 = () => {
    type1 === "password" ? setType1("text") : setType1("password");
  };
  const toggleType2 = () => {
    type2 === "password" ? setType2("text") : setType2("password");
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !password2) {
      toast.error("Please fill in all fields!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    if (password !== password2) {
      toast.error("Password does not match!", {
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
      name,
      email,
      password,
      password2,
    };
    setIsLoading(true);

    try {
      const data = await registerUser(userData);
      if (data) {
        dispatch(SET_LOGIN(true));
        dispatch(SET_NAME(data.name));
        dispatch(SET_CURRENCY(""));
        navigate("/dashboard");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Registeration Failed!", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  return (
    <Card
      text="Register"
      icon={icon}
      children={registerForm(
        toggleType1,
        toggleType2,
        type1,
        type2,
        showIcon1,
        showIcon2,
        handleChange,
        handleSubmit,
        isLoading
      )}
    />
  );
};

const registerForm = (
  toggleType1,
  toggleType2,
  type1,
  type2,
  showIcon1,
  showIcon2,
  handleChange,
  handleSubmit,
  isLoading
) => {
  return (
    <div className="children">
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="name"
          required
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          onChange={handleChange}
        />
        <div className="password">
          <input
            type={type1}
            placeholder="Password"
            name="password"
            required
            onChange={handleChange}
          />
          <span onClick={toggleType1}>{showIcon1()}</span>
        </div>
        <div className="password">
          <input
            type={type2}
            placeholder="Confirm Password"
            name="password2"
            required
            onChange={handleChange}
          />
          <span onClick={toggleType2}>{showIcon2()}</span>
        </div>
        <button type="submit" className="--btn --btn-primary">
          Register
        </button>
      </form>
      <span>
        <Link to="/">
          <p className="blueText">Home</p>
        </Link>
        <p>&nbsp; Already have an account? &rarr;</p>
        <Link to="/login">
          <p className="blueText">Login</p>
        </Link>
      </span>
    </div>
  );
};

export default Register;
