/* Route for handling anime data */

const express = require("express");
const router = express.Router();

// Controller Methods
const {
  searchAnime,
  addToWatchlist,
  getWatchlist,
  deleteFromWatchlist,
  updateWatchlist,
} = require("../../../../controller/api/v1/features/animeController");

// Protect auth middleware
const { protect } = require("../../../../middleware/auth");

// Route to endpoints
router.route("/searchAnime").post(protect, searchAnime);
router.route("/addToWatchlist").post(protect, addToWatchlist);
router.route("/getWatchlist").get(protect, getWatchlist);
router.route("/deleteFromWatchlist/:id").delete(protect, deleteFromWatchlist);
router.route("/updateWatchlist/:id").put(protect, updateWatchlist);

module.exports = router;
