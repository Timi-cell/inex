import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredItems: [],
  message: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    SEARCH_ITEMS(state, action) {
      const { search, items } = action.payload;
      if (search !== "") {
        const filtered = items.filter((item) =>
          item.title.toLowerCase().includes(search.trim().toLowerCase())
        );
        state.filteredItems = filtered;
        if (filtered.length === 0) {
          state.message = true;
        }
      } else {
          state.filteredItems = items;
          state.message = false;
      }
    },
    FILTER_ITEMS(state, action) {
      const { fValue, items } = action.payload;
      if (fValue !== "") {
        const filtered = items.filter((item) => item.type === fValue);
        state.filteredItems = filtered;
      } else {
        state.filteredItems = items;
      }
    },
  },
});

export const { SEARCH_ITEMS, FILTER_ITEMS } = filterSlice.actions;
export const selectFilteredItems = (state) => state.filter.filteredItems;
export const selectMessage = (state) => state.filter.message;
export default filterSlice.reducer;
