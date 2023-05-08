const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    type: {
      type: String,
      required: [true, "Please pick a type"],
    },
    value: {
      type: Number,
      required: [true, "Please enter a value"],
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
