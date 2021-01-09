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
  getUserWatchlist,
} = require("../../../../controller/api/v1/features/animeController");
const {
  getAnimeDetails,
  getAnimeReviews,
  getAnimeWatchlistStats,
} = require("../../../../controller/api/v1/features/animeDetailsController");

// Protect auth middleware
const { protect } = require("../../../../middleware/auth");

// Route to endpoints
router.route("/searchAnime").post(protect, searchAnime);
router.route("/addToWatchlist").post(protect, addToWatchlist);
router.route("/getWatchlist").get(protect, getWatchlist);
router.route("/getUserWatchlist").post(getUserWatchlist);
router.route("/deleteFromWatchlist/:id").delete(protect, deleteFromWatchlist);
router.route("/updateWatchlist/:id").put(protect, updateWatchlist);
router.route("/anime-details/:id").get(protect, getAnimeDetails);
router.route("/anime-review/:id").get(protect, getAnimeReviews);
router.route("/getWatchlistStats").get(protect, getAnimeWatchlistStats);

module.exports = router;
