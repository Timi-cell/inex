import React, { useEffect, useState } from "react";
import "./Profile.scss";
import {
  SET_IS_OPEN,
  SET_USER,
  selectUser,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../services/authService";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";
import { SET_NAME } from "../../redux/features/auth/authSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [data, setData] = useState(user);
  const { name, email, phone } = data;
  const [isLoading, setIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setUserPhoto(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    if (userPhoto) {
      formData.append("photo", userPhoto);
    }
    const response = await updateUser(formData);
    if (response) {
      setIsLoading(true);
      toast.success("Profile Updated!", {
        position: toast.POSITION.TOP_LEFT,
      });
      navigate("/profile");
      setIsLoading(false);
      dispatch(SET_NAME(response.name));
    } else {
      setIsLoading(false);
      toast.error("Profile Update Failed", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
  useEffect(() => {
    setData(user);
    setImagePreview(user && user.photo ? user.photo : null);
  }, [user]);
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
    <div className="editprofile">
      {isLoading && <Loader />}
      <h2>EditProfile</h2>
      <div className="editprofilecontent --mt1">
        <div className="editphoto">
          <img src={imagePreview} alt="userphoto" />
          <label htmlFor="pic" className="--btn --btn-primary --mt1">
            Change Photo{" "}
            <input
              type="file"
              name="photo"
              id="pic"
              accept="image/*"
              placeholder="upload picture"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <form onSubmit={saveUser}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              value={name}
              id="name"
              name="name"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              name="email"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              value={phone}
              id="phone"
              name="phone"
              onChange={handleInputChange}
            />
          </div>
          <button className="--btn --btn-primary --mt1">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
