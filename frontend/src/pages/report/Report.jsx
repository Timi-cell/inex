import React, { useEffect, useState } from "react";
import "./Report.scss";
import { toast } from "react-toastify";
import { getUserReport } from "../../services/authService";
import Loader from "../../components/loader/Loader";
import { SET_IS_OPEN } from "../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";


const initialState = {
  subject: "",
  message: "",
};
const Report = () => {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  let { subject, message } = data;
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Please fill in all required fields!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    try {
      setIsLoading(true);
      await getUserReport(data);
      setData(initialState);
      setIsLoading(false);
    } catch (error) {
      toast.error("Report could not be sent, please try again!", {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(SET_IS_OPEN(false));
    setIsLoading(false);
  }, [dispatch]);

  return (
    <div className="report">
      {isLoading && <Loader />}
      <h2>Report Bug</h2>
      <div className="--mt1">
        <p>Send a message to us, we asssure prompt replies.</p>
        <p className="--mt1">
          You can also drop suggestions on what you want InEx to implement.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="sub">Subject</label>
          <input
            type="text"
            placeholder="Subject..."
            onChange={handleChange}
            id="sub"
            value={subject}
            name="subject"
          />
        </div>
        <div>
          <label htmlFor="msg">Message</label>
          <textarea
            placeholder="Message..."
            value={message}
            rows="7"
            onChange={handleChange}
            id="msg"
            name="message"
          />
        </div>
        <button type="submit" className="--btn --btn-primary --mt1">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Report;
