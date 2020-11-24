/* Controller for providing service related to specific anime details */

const ErrorResponse = require("../../../../utils/ErrorResponse");
const asyncHandler = require("../../../../middleware/asyncHandler");
const Anime = require("../../../../model/Anime");
const axios = require("axios");

/*
 * POST /api/v1/features/anime-details/:id
 * Access - Private
 * Desc - Searches for an anime from an external API
 */
exports.getAnimeDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const endPointToCall = `https://api.jikan.moe/v3/anime/${id}`;
  let isAnimeAlreadyPresent = false;

  if (!id) {
    return next(
      new ErrorResponse("Please provide the MAL ID of the anime.", 400)
    );
  }

  // Check if for the user the anime is already present in the DB or not
  const anime = await Anime.find({ malId: id, user: req.user.id });
  if (anime.length === 0) {
    isAnimeAlreadyPresent = false;
  } else {
    isAnimeAlreadyPresent = true;
  }

  try {
    const { data } = await axios.get(endPointToCall);
    return res.status(200).json({
      success: true,
      isAnimeAlreadyPresent,
      data,
    });
  } catch (err) {
    return next(new ErrorResponse("Anime information cannot be fetched.", 500));
  }
});

/*
 * POST /api/v1/features/anime-review/:id
 * Access - Private
 * Desc - Searches for an anime from an external API
 */
exports.getAnimeReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const endPointToCall = `https://api.jikan.moe/v3/anime/${id}/reviews/`;

  if (!id) {
    return next(
      new ErrorResponse("Please provide the MAL ID of the anime.", 400)
    );
  }

  try {
    const { data } = await axios.get(endPointToCall);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return next(new ErrorResponse("Anime review cannot be fetched.", 500));
  }
});
