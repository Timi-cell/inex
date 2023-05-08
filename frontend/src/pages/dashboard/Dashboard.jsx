import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import InfoBox from "../../components/infoBox/InfoBox";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { MdAccountBalanceWallet } from "react-icons/md";
import ItemsList from "../../components/itemsList/ItemsList";
import { FaSearch } from "react-icons/fa";
import { SET_IS_OPEN, selectName } from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CALC_BAL,
  CALC_EXP,
  CALC_INC,
  SET_ITEM_ID,
  addItem,
  deleteItem,
  getItems,
  updateItem,
} from "../../redux/features/item/itemSlice";
import {
  FILTER_ITEMS,
  SEARCH_ITEMS,
  selectFilteredItems,
  selectMessage,
} from "../../redux/features/filter/filterSlice";

const initialState = {
  type: "",
  title: "",
  value: "",
};

let buttonText = "Add";
// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const [data, setData] = useState(initialState);
  const [search, setSearch] = useState("");
  const [fValue, setfValue] = useState("");
  const dispatch = useDispatch();
  const { type, title, value } = data;
  const name = useSelector(selectName);
  // const isOpen = useSelector(selectIsOpen);
  const message = useSelector(selectMessage);
  const filteredItems = useSelector(selectFilteredItems);
  const {
    loadingStatus,
    totalIncome,
    totalExpenses,
    totalBalance,
    items,
    itemID,
  } = useSelector((state) => state.item);

  const dateNow = () => {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const refreshPage = () => {
    dispatch(getItems());
    dispatch(CALC_INC(items));
    dispatch(CALC_EXP(items));
    dispatch(CALC_BAL());
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !type || !value) {
      toast.error("Please fill in all fields!", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    dispatch(addItem(data));
    refreshPage();
    setData(initialState);
  };
  const handleDelete = (id) => {
    dispatch(deleteItem(id));
    refreshPage();
  };
  const confirmDelete = (id, item) => {
    confirmAlert({
      title: "DELETE ITEM",
      message: `Are you sure you want to delete this ${item.type.toLowerCase()} item named "${item.title.toLowerCase()}"?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleEdit = (item) => {
    buttonText = "Edit";
    setData({
      type: item.type || data.type,
      title: item.title || data.title,
      value: item.value || data.value,
    });
    dispatch(SET_ITEM_ID(item._id));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const _id = itemID;
    const updatedItemData = { _id, ...data };
    try {
      dispatch(updateItem(updatedItemData));
      buttonText = "Add";
      refreshPage();
      toast.success(`${updatedItemData.type} updated!`, {
        position: toast.POSITION.TOP_LEFT,
      });
      setData(initialState);
    } catch (error) {
      buttonText = "Edit";
      toast.error("Item could not be updated", {
        position: toast.POSITION.TOP_LEFT,
      });
      setData(initialState);
    }
  };

  useEffect(() => {
    dispatch(SEARCH_ITEMS({ search, items }));
  }, [dispatch, search, items]);

  useEffect(() => {
    dispatch(FILTER_ITEMS({ fValue, items }));
  }, [dispatch, fValue, items]);

  useEffect(() => {
    if (loadingStatus === "idle") {
      dispatch(getItems());
    }
    dispatch(SET_IS_OPEN(false));
    dispatch(CALC_INC(items));
    dispatch(CALC_EXP(items));
    dispatch(CALC_BAL());
    // if (totalBalance < 500) {
    //   toast.warning("You are spending more than you are earning!", {
    //     position: toast.POSITION.TOP_LEFT,
    //   });
    // }
  }, [dispatch, items, loadingStatus]);

  return (
    <div className="dash">
      <div className="top">
        <h2>
          Welcome, <span id="name">{name}</span>
        </h2>
        <p className="date">{dateNow()}</p>
      </div>
      <div className="boxes">
        <InfoBox
          title="Total Income"
          color="var(--green)"
          value={formatNumbers(totalIncome)}
          icon={<GiReceiveMoney size={35} />}
        />
        <InfoBox
          title="Total Expenses"
          color="var(--red)"
          value={formatNumbers(totalExpenses)}
          icon={<GiPayMoney size={35} />}
        />
        <InfoBox
          title="Balance"
          color="var(--blue)"
          value={formatNumbers(totalBalance)}
          icon={<MdAccountBalanceWallet size={35} />}
        />
      </div>
      {/* <p id="warning">
        {totalBalance < 100
          ? `Hello ${name}, you are spending more than you are earning!`
          : ""}
      </p> */}

      <form onSubmit={buttonText === "Add" ? handleSubmit : handleUpdate}>
        <div className="add-item">
          {/* Pick a type dropdown list */}
          <select name="type" value={type} onChange={handleChange}>
            <option value="">Pick a type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          {/* Add title */}
          <input
            type="text"
            name="title"
            spellCheck="false"
            placeholder="Title...(e.g, Salary, Food)"
            onChange={handleChange}
            value={title}
          />
          {/* Add value */}
          <input
            type="number"
            name="value"
            spellCheck="false"
            placeholder="Value..."
            onChange={handleChange}
            value={value}
          />
          {/* Submit button */}
          <button type="submit" className="--btn --btn-primary">
            {buttonText}
          </button>
        </div>
      </form>

      <div className="sf">
        {" "}
        {/* Search Field */}
        <div className="search">
          <FaSearch size={25} />
          <input
            type="text"
            spellCheck="false"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Filter */}
        <div>
          <select value={fValue} onChange={(e) => setfValue(e.target.value)}>
            <option value="">Filter By Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expenses</option>
          </select>
        </div>
      </div>
      <ItemsList
        loadingStatus={loadingStatus}
        items={filteredItems}
        deleteItem={confirmDelete}
        editItem={handleEdit}
        message={message}
      />
    </div>
  );
};

export default Dashboard;
