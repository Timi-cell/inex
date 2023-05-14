import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { formatNumbers } from "../../pages/dashboard/Dashboard";
import { getItems } from "../../redux/features/item/itemSlice";
import "./Chart.scss";
import { SET_IS_OPEN } from "../../redux/features/auth/authSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import colors from "color-name";

const Chart = () => {
  useRedirectLoggedOutUser("/login");
  const { items, userCurrency } = useSelector((state) => state.item);
  const [incItems, setIncItems] = useState([]);
  const [expItems, setExpItems] = useState([]);
  const dispatch = useDispatch();
  const allColors = Object.keys(colors);
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const customToolTip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} : ${userCurrency}${formatNumbers(
            payload[0].value
          )}`}</label>
        </div>
      );
    }
    return null;
  };
  let incomePieData = [];
  let expensePieData = [];

  if (incItems.length > 0) {
    for (let item of incItems) {
      incomePieData.push({ name: item.title, value: item.value });
    }
  }

  if (expItems.length > 0) {
    for (let item of expItems) {
      expensePieData.push({ name: item.title, value: item.value });
    }
  }
  useEffect(() => {
    dispatch(SET_IS_OPEN(false));
  }, [dispatch]);
  useEffect(() => {
    function setAll() {
      dispatch(getItems());
      if (items.length > 0) {
        // setAllItems(items);
        const allInc = items.filter((item) => item.type === "Income");
        const allExp = items.filter((item) => item.type === "Expense");
        setIncItems(allInc);
        setExpItems(allExp);
      }
    }
    setAll();
  }, [dispatch, items]);

  return (
    <div className="chart">
      <h2>Chart</h2>
      {/* INCOME CHART */}
      {incItems.length > 0 ? (
        <div className="--mt1 pieChart">
          <h2>Income Chart</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={incomePieData}
                labelLine={false}
                color="#000000"
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={155}
                label={renderCustomizedLabel}
                fill="#8884d8"
              >
                {incomePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={allColors[allColors.length - (index + 5)]}
                  />
                ))}
              </Pie>
              <Tooltip content={customToolTip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No income data, Please add.</p>
      )}

      {/* EXPENSES CHART */}
      {expItems.length > 0 ? (
        <div className="pieChart exp">
          <h2>Expenses Chart</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={expensePieData}
                labelLine={false}
                color="#000000"
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={155}
                label={renderCustomizedLabel}
                fill="#8884d8"
              >
                {expensePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={allColors[allColors.length - (index + 5)]}
                  />
                ))}
              </Pie>
              <Tooltip content={customToolTip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="exp">
          <p>No expenses data, Please add.</p>
        </div>
      )}
    </div>
  );
};

export default Chart;
