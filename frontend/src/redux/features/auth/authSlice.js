import { createSlice } from "@reduxjs/toolkit";
const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  name: name ? name : "",
  isOpen: false,
  isLoggedIn: false,
  user: {
    name: "",
    email: "",
    phone: "",
    photo: "",
    createdAt: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_IS_OPEN(state, action) {
      state.isOpen = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const data = action.payload;
      state.user.name = data.name;
      state.user.email = data.email;
      state.user.phone = data.phone;
      state.user.photo = data.photo;
      state.user.createdAt = data.createdAt;
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER, SET_IS_OPEN } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsOpen = (state) => state.auth.isOpen;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
