import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import itemReducer from "../redux/features/item/itemSlice";
import filterReducer from "../redux/features/filter/filterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    item: itemReducer,
    filter: filterReducer,
  },
});
