const Item = require("../models/itemModel");
const asyncHandler = require("express-async-handler");

// Add Item
const addItem = asyncHandler(async (req, res) => {
  const { title, type, value, currency } = req.body;
  if (!title || !type || !value) {
    res.status(400).json({ message: "Please fill in all required fields" });
  }
  const item = await Item.create({
    user: req.user._id,
    userName: req.user.name,
    currency,
    title,
    type,
    value,
  });
  const allItems = await Item.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  if (item) {
    res.status(201).json({ allItems, item });
  } else {
    res
      .status(500)
      .json({
        message: "Please check your network connectivity OR refresh the page.",
      });
    throw new Error(
      "Please check your network connectivity OR refresh the page."
    );
  }
});

// Update Item
const updateItem = asyncHandler(async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(
    { _id: req.body._id },
    {
      title: req.body.title,
      type: req.body.type,
      value: req.body.value,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const allItems = await Item.find({ user: req.user._id }).sort({
    updatedAt: -1,
  });
  if (updatedItem) {
    res.status(200).json(allItems);
  } else {
    res.status(400).json({ message: "Item could not be updated" });
    throw new Error("Item could not be updated");
  }
});

// Get All Items
const getItems = asyncHandler(async (req, res) => {
  const allItems = await Item.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  if (allItems) {
    res.status(200).json(allItems);
  } else {
    res.status(400).json({ message: "Items not found" });
    throw new Error("Items not found");
  }
});

// Delete Item
const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (item) {
    await Item.deleteOne({ _id: id });
    const allItems = await Item.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(allItems);
  } else {
    res.status(400).json({ message: "Item not found" });
    throw new Error("Item not found");
  }
});

module.exports = {
  addItem,
  getItems,
  updateItem,
  deleteItem,
};
