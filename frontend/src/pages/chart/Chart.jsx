import React, { Component } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const colors = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
const pieData = [
  {
    name: "Apple",
    value: 54.85,
  },
  {
    name: "Samsung",
    value: 47.91,
  },
  {
    name: "Redmi",
    value: 16.85,
  },
  {
    name: "One Plus",
    value: 16.14,
  },
  {
    name: "Others",
    value: 10.25,
  },
];
const CustomToolTip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div
        // className="custom-tooltip"
        style={{
          backgroundColor: "#ffff",
          padding: "5px",
          border: "1px solid #cccc",
        }}
      >
        <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
      </div>
    );
  }
  return null;
};
class Chart extends Component {
  render() {
    return (
      <PieChart width={730} height={300}>
        <Pie
          data={pieData}
          color="#000000"
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomToolTip} />
        <Legend />
      </PieChart>
    );
  }
}
export default Chart;
