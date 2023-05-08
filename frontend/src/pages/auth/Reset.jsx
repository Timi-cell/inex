import React, { useState } from "react";
import Card from "../../components/card/Card";
import { MdLockReset } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/authService";

const icon = <MdLockReset color="var(--grey)" size={45} />;
const eye = <AiFillEye size={25} color="#eee" />;
const eyeHide = <AiFillEyeInvisible size={25} color="#eee" />;

const Reset = () => {
  const navigate = useNavigate();
  const initialState = {
    password: "",
    password2: "",
  };
  const { resetToken } = useParams();
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;
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
    if (!password || !password2) {
      toast.error("Please fill in all fields!", {
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
    if (password !== password2) {
      toast.error("Password does not match!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    const userData = {
      password,
    };
    try {
      const data = await resetPassword(resetToken, userData);
      if (data) {
        toast.success(data.message, {
          position: toast.POSITION.TOP_LEFT,
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error("Password Reset Failed!", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  return (
    <Card
      icon={icon}
      text="Reset Password"
      children={resetForm(
        type1,
        type2,
        toggleType1,
        toggleType2,
        showIcon1,
        showIcon2,
        handleChange,
        handleSubmit
      )}
    />
  );
};

const resetForm = (
  type1,
  type2,
  toggleType1,
  toggleType2,
  showIcon1,
  showIcon2,
  handleChange,
  handleSubmit
) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="password">
          <input
            type={type1}
            required
            name="password"
            placeholder="New Password"
            onChange={handleChange}
          />
          <span onClick={toggleType1}>{showIcon1()}</span>
        </div>
        <div className="password">
          <input
            type={type2}
            required
            name="password2"
            placeholder="Confirm New Password"
            onChange={handleChange}
          />
          <span onClick={toggleType2}>{showIcon2()}</span>
        </div>
        <button type="submit" className="--btn --btn-primary">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default Reset;
