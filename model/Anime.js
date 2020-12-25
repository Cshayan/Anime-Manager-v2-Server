/* Model for User */

const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  animeData: {
    type: Object,
    required: [true, "Please provided anime details to add to your watchlist"],
  },
  malId: {
    type: Number,
    required: [true, "Please provide the MAL ID."],
  },
  animeStatus: {
    type: String,
    default: "Unwatched",
    enum: [
      "Unwatched",
      "Watching",
      "Completed",
      "Dropped",
      "Not Released",
      "On Hold",
    ],
  },
  urlToWatch: {
    type: String,
    default: "#",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Export model
module.exports = mongoose.model("Anime", AnimeSchema);
