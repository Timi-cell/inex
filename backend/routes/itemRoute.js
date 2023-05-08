const express = require("express");
const {
  addItem,
  updateItem,
  deleteItem,
  getItems,
} = require("../controllers/itemController");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");


router.get("/", protect, getItems);
router.post("/add", protect, addItem);
router.patch("/update", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
