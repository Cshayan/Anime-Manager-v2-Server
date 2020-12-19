/* Controller for handling data related to animes */

const ErrorResponse = require("../../../../utils/ErrorResponse");
const asyncHandler = require("../../../../middleware/asyncHandler");
const Anime = require("../../../../model/Anime");
const axios = require("axios");

/*
 * POST /api/v1/features/searchAnime
 * Access - Private
 * Desc - Searches for an anime from an external API
 */
exports.searchAnime = asyncHandler(async (req, res, next) => {
  const animeURL = "https://api.jikan.moe/v3/search/anime";
  const { animeName } = req.body;

  if (!animeName) {
    return next(
      new ErrorResponse("Please provide an anime name to search for.", 400)
    );
  }

  try {
    const { data } = await axios.get(`${animeURL}?q=${animeName}&limit=6`);
    return res.status(200).json({
      success: true,
      data: data.results,
    });
  } catch (err) {
    if (err.response.status === 404) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    return next(new ErrorResponse("Anime information cannot be fetched.", 500));
  }
});

/*
 * POST /api/v1/features/addToWatchlist
 * Access - Private
 * Desc - Add anime to your watchlist
 */
exports.addToWatchlist = asyncHandler(async (req, res, next) => {
  const { animeData, animeStatus } = req.body;

  if (!animeData) {
    return next(
      new ErrorResponse(
        "Please provide some anime details to add it to your watchlist",
        400
      )
    );
  }

  if (animeData && Object.values(animeData).length === 0) {
    return next(
      new ErrorResponse(
        "Please provide some anime details to add it to your watchlist",
        400
      )
    );
  }

  animeData.user = req.user.id;

  const addedAnimeData = await Anime.create({
    malId: animeData.mal_id,
    animeData,
    animeStatus,
    user: req.user.id,
  });

  return res.status(201).json({
    success: true,
    msg: "Anime added to your watchlist",
    data: addedAnimeData,
  });
});

/*
 * GET /api/v1/features/getWatchlist
 * Access - Private
 * Desc - Fetches all anime details for a particular user
 */
exports.getWatchlist = asyncHandler(async (req, res, next) => {
  const animeWatchlist = await Anime.find({ user: req.user.id })
    .select("-user")
    .sort({ addedAt: -1 });

  if (!animeWatchlist || animeWatchlist.length === 0) {
    return next(new ErrorResponse("No watchlist found for the user.", 404));
  }

  return res.status(200).json({
    success: true,
    count: animeWatchlist.length,
    data: animeWatchlist,
  });
});

/*
 * DELETE /api/v1/features/deleteFromWatchlist/:id
 * Access - Private
 * Desc - Delete a particular anime from watchlist
 */
exports.deleteFromWatchlist = asyncHandler(async (req, res, next) => {
  const anime = await Anime.findById(req.params.id);

  if (!anime) {
    return next(new ErrorResponse("No anime with such id present", 404));
  }

  // only the correct user can delete the anime from watchlist
  if (anime.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorised to delete the anime.", 401));
  }

  await anime.remove();

  res.status(200).json({
    success: true,
    msg: "Anime deleted successfully from watchlist",
    data: {},
  });
});

/*
 * PUT /api/v1/features/updateWatchlist/:id
 * Access - Private
 * Desc - Updates info of a particular anime in the watchlist
 */
exports.updateWatchlist = asyncHandler(async (req, res, next) => {
  const anime = await Anime.findById(req.params.id);

  if (!anime) {
    return next(new ErrorResponse("No anime with such id present", 404));
  }

  // only the correct user can update the anime from watchlist
  if (anime.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorised to update the anime.", 401));
  }

  if (req.body.animeData) req.body.animeData.user = req.user.id;

  const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    msg: "Anime updated successfully",
    data: updatedAnime,
  });
});
