import React, { useState } from "react";
import Card from "../../components/card/Card";
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";

const icon = <AiOutlineMail color="var(--grey)" size={45} />;

const Forgot = () => {
  const [email, setEmail] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!", {
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
    const userData = { email };
    await forgotPassword(userData);
    setEmail("");
  };
  return (
    <Card
      icon={icon}
      text="Forgot Password"
      children={forgotForm(handleChange, handleSubmit, email)}
    />
  );
};

const forgotForm = (handleChange, handleSubmit, email) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        <button type="submit" className="--btn --btn-primary">
          Get Reset Email
        </button>
      </form>
      <span>
        <Link to="/">
          <p className="blueText">- Home</p>
        </Link>
        <Link to="/login">
          <p className="blueText">Login -</p>
        </Link>
      </span>
    </div>
  );
};

export default Forgot;
