import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import InfoBox from "../../components/infoBox/InfoBox";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BiRefresh } from "react-icons/bi";
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
  SET_CURRENCY,
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

let buttonText = "Add";
// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  // const [cur, setCur] = useState("");
  const [search, setSearch] = useState("");
  const [fValue, setfValue] = useState("");
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  // const isOpen = useSelector(selectIsOpen);
  const message = useSelector(selectMessage);
  const filteredItems = useSelector(selectFilteredItems);
  let {
    loadingStatus,
    totalIncome,
    totalExpenses,
    totalBalance,
    items,
    itemID,
    userCurrency,
  } = useSelector((state) => state.item);
  const initialState = {
    currency: userCurrency,
    type: "",
    title: "",
    value: "",
  };
  const [data, setData] = useState(initialState);

  const {  type, title, value } = data;

  // const dateNow = () => {
  //   return new Date().toLocaleDateString("en-us", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    if (items.length > 0) {
      const det = items.every((item) => item.currency === value);
      // console.log(det);
      if (!det) {
        toast.warning(
          "You've already chosen a default currency for this account. Open a new account to use a different currency.",
          {
            position: toast.POSITION.TOP_LEFT,
          }
        );
      }
      return;
    } else {
      // setCur(value);
      setData({
        ...data,
        [name]: value,
      });
      dispatch(SET_CURRENCY(value));
    }
  };
  const refreshPage = () => {
    dispatch(getItems());
    dispatch(CALC_INC(items));
    dispatch(CALC_EXP(items));
    dispatch(CALC_BAL());
    dispatch(SET_CURRENCY(userCurrency));
    // if (items.length > 0) {
    //   dispatch(SET_CURRENCY(items[0].currency));
    // } else {
    //   dispatch(SET_CURRENCY(currency));
    // }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!title || !type || !value || !currency) {
    //   toast.error("Please fill in all fields.", {
    //     position: toast.POSITION.TOP_LEFT,
    //   });
    //   return;
    // }
    if (!userCurrency) {
      toast.error("Please choose a currency.", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    if (!type) {
      toast.error("Please pick a type.", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    if (!title) {
      toast.error("Please choose a title.", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }

    if (!value) {
      toast.error("Please add a value.", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    // console.log(data);
    dispatch(addItem(data));
    dispatch(SET_CURRENCY(userCurrency));
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
      currency: item.currency || data.currency,
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
  const handleCancelEdit = () => {
    setData(initialState);
    buttonText = "Add";
  };
  const handleRefresh = () => {
    refreshPage();
    toast.success("List Refreshed.", {
      position: toast.POSITION.TOP_LEFT,
    });
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
      // dispatch(SET_CURRENCY(currency));
    }
    // if (localStorage.getItem("currency") === null) {
    //   dispatch(SET_CURRENCY(currency));
    // }
    if (items.length > 0) {
      // console.log(items);
      dispatch(SET_CURRENCY(items[0].currency));
    } else {
      dispatch(SET_CURRENCY(""));
    }
    dispatch(SET_IS_OPEN(false));
    dispatch(CALC_INC(items));
    dispatch(CALC_EXP(items));
    dispatch(CALC_BAL());
    // console.log(userCurrency)
  }, [dispatch, items, loadingStatus]);

  return (
    <div className="dash">
      <div className="top">
        <h2>
          Welcome, <span id="name">{name}</span>
        </h2>
        {/* Pick a currency dropdown list*/}
        <select
          name="currency"
          value={userCurrency}
          onChange={handleCurrencyChange}
        >
          <option value="">Choose default currency</option>
          <option value="₦">Naira (₦)</option>
          <option value="$">U.S Dollar ($)</option>
          <option value="€">Euro (€)</option>
          <option value="£">Pound Sterling (£)</option>
          <option value="₵">Cedi (₵)</option>
          <option value="CFA">Cefa (CFA)</option>
          <option value="¥">Yen (¥)</option>
          <option value="₹">Rupee (₹)</option>
        </select>
        {/* <p className="date">{dateNow()}</p> */}
      </div>
      <div className="boxes">
        <InfoBox
          title="Total Income"
          color="var(--green)"
          value={formatNumbers(totalIncome)}
          icon={<GiReceiveMoney size={35} />}
          currency={userCurrency}
        />
        <InfoBox
          title="Total Expenses"
          color="var(--red)"
          value={formatNumbers(totalExpenses)}
          icon={<GiPayMoney size={35} />}
          currency={userCurrency}
        />
        <InfoBox
          title="Balance"
          color="var(--blue)"
          value={formatNumbers(totalBalance)}
          icon={<MdAccountBalanceWallet size={35} />}
          currency={userCurrency}
        />
      </div>
      <p id="goodInfo">
        {(totalExpenses / totalIncome) * 100 < 50
          ? `Hey ${name}, your earnings are more than your expenses👍.`
          : ""}
      </p>
      <p id="warning">
        {/* {totalBalance === 0 ? `Hey ${name}, you have no balance left.` : ""} */}
        {(totalExpenses / totalIncome) * 100 === 50
          ? `Hey ${name}, you have spent 50% of your income.`
          : ""}

        {(totalExpenses / totalIncome) * 100 > 50 &&
        (totalExpenses / totalIncome) * 100 < 100
          ? `Hey ${name}, you have spent more than 50% of your income.`
          : ""}
        {totalBalance < 0
          ? `Hey ${name}, your expenses are more than your income.`
          : ""}
      </p>

      <form onSubmit={buttonText === "Add" ? handleSubmit : handleUpdate}>
        <div className="add-item">
          {/* Pick a type dropdown list */}
          <select name="type" value={type} onChange={handleChange}>
            <option value="">Choose a type</option>
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
            autoFocus={buttonText === "Edit" ? true : false}
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
          <div className="buttons">
            {/* Add/Edit button */}
            <button type="submit" className="--btn --btn-primary">
              {buttonText}
            </button>
            {/* Cancel Edit Button */}
            {buttonText === "Edit" ? (
              <button className="--btn --btn-danger edit" onClick={handleCancelEdit}>
                Cancel Edit
              </button>
            ) : (
              ""
            )}
          </div>
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
            <option value="">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expenses Only</option>
          </select>
        </div>
      </div>
      <div>
        <button
          className="--btn --btn-primary --mt1 refresh"
          onClick={handleRefresh}
        >
          <span>REFRESH LIST</span>{" "}
          <span>
            <BiRefresh size={25.5} />
          </span>
        </button>
      </div>
      <ItemsList
        loadingStatus={loadingStatus}
        items={filteredItems}
        deleteItem={confirmDelete}
        editItem={handleEdit}
        message={message}
        currency={userCurrency}
      />
    </div>
  );
};

export default Dashboard;
