import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import itemService from "../../../services/itemService";
import { toast } from "react-toastify";

const initialState = {
  items: [],
  loadingStatus: "idle",
  totalIncome: 0,
  totalExpenses: 0,
  totalBalance: 0,
  itemID: "",
};

// Add Item
export const addItem = createAsyncThunk(
  "items/add",
  async (itemData, thunkAPI) => {
    try {
      return await itemService.addItem(itemData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Items
export const getItems = createAsyncThunk(
  "items/getAll",
  async (_, thunkAPI) => {
    try {
      return await itemService.getItems();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Item
export const deleteItem = createAsyncThunk(
  "items/deleteOne",
  async (id, thunkAPI) => {
    try {
      return await itemService.deleteItem(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Item
export const updateItem = createAsyncThunk(
  "items/updateOne",
  async (itemData, thunkAPI) => {
    try {
      return await itemService.updateItem(itemData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    SET_ITEMS_INFO(state) {
      state.items = [];
      state.totalIncome = 0;
      state.totalExpenses = 0;
      state.totalBalance = 0;
      state.itemID = "";
    },
    CALC_INC(state, action) {
      const items = action.payload.filter((item) => item.type === "Income");
      const incomeValues = [];
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          incomeValues.push(items[i].value);
        }
        state.totalIncome = incomeValues.reduce((a, b) => a + b, 0);
      } else {
        state.totalIncome = 0;
      }
    },
    CALC_EXP(state, action) {
      const items = action.payload.filter((item) => item.type === "Expense");
      const expenseValues = [];
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          expenseValues.push(items[i].value);
        }
        state.totalExpenses = expenseValues.reduce((a, b) => a + b, 0);
      } else {
        state.totalExpenses = 0;
      }
    },
    CALC_BAL(state) {
      const { totalIncome, totalExpenses } = state;
      state.totalBalance = totalIncome - totalExpenses;
    },
    SET_ITEM_ID(state, action) {
      state.itemID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItem.pending, (state) => {
      state.loadingStatus = "loading";
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      const { allItems, item } = action.payload;
      state.items = allItems;
      state.loadingStatus = "succeeded";
      toast.success(`${item.type} added!`, {
        position: toast.POSITION.TOP_LEFT,
      });
    });
    builder.addCase(addItem.rejected, (state, action) => {
      const { allItems, item } = action.payload;
      state.items = allItems;
      state.loadingStatus = "failed";
      toast.success(`${item.type} added!`, {
        position: toast.POSITION.TOP_LEFT,
      });
    });
    builder.addCase(getItems.pending, (state) => {
      state.loadingStatus = "loading";
    });
    builder.addCase(getItems.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loadingStatus = "succeeded";
    });
    builder.addCase(getItems.rejected, (state) => {
      state.loadingStatus = "failed";
    });
    builder.addCase(deleteItem.pending, (state) => {
      state.loadingStatus = "loading";
    });
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.loadingStatus = "succeeded";
      state.items = action.payload;
      toast.success("Item deleted!", {
        position: toast.POSITION.TOP_LEFT,
      });
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      state.loadingStatus = "failed";
      toast.error(action.payload.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    });
    builder.addCase(updateItem.pending, (state) => {
      state.loadingStatus = "loading";
    });
    builder.addCase(updateItem.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loadingStatus = "succeeded";
    });
    builder.addCase(updateItem.rejected, (state, action) => {
      state.loadingStatus = "failed";
      toast.error(action.payload.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    });
  },
});

export const { CALC_INC, CALC_EXP, CALC_BAL, SET_ITEM_ID, SET_ITEMS_INFO } =
  itemSlice.actions;
export default itemSlice.reducer;
