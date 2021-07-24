/* Controller for providing service related to specific anime details */

const ErrorResponse = require('../../../../utils/ErrorResponse')
const asyncHandler = require('../../../../middleware/asyncHandler')
const Anime = require('../../../../model/Anime')
const axios = require('axios')

/*
 * POST /api/v1/features/anime-details/:id
 * Access - Private and Public
 * Desc - Searches for an anime from an external API
 */
exports.getAnimeDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const endPointToCall = `https://api.jikan.moe/v3/anime/${id}`
  let isAnimeAlreadyPresent = false

  if (!id) {
    return next(
      new ErrorResponse('Please provide the MAL ID of the anime.', 400)
    )
  }

  if (req.user) {
    // Check if for the user the anime is already present in the DB or not
    const anime = await Anime.find({ malId: id, user: req.user.id })
    if (anime.length === 0) {
      isAnimeAlreadyPresent = false
    } else {
      isAnimeAlreadyPresent = true
    }
  }

  try {
    const { data } = await axios.get(endPointToCall)
    return res.status(200).json({
      success: true,
      isAnimeAlreadyPresent,
      data,
    })
  } catch (err) {
    return next(new ErrorResponse('Anime information cannot be fetched.', 500))
  }
})

/*
 * POST /api/v1/features/anime-review/:id
 * Access - Private
 * Desc - Searches for an anime from an external API
 */
exports.getAnimeReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const endPointToCall = `https://api.jikan.moe/v3/anime/${id}/reviews/`

  if (!id) {
    return next(
      new ErrorResponse('Please provide the MAL ID of the anime.', 400)
    )
  }

  try {
    const { data } = await axios.get(endPointToCall)
    return res.status(200).json({
      success: true,
      data,
    })
  } catch (err) {
    return next(new ErrorResponse('Anime review cannot be fetched.', 500))
  }
})

exports.getAnimeWatchlistStats = asyncHandler(async (req, res, next) => {
  // Get the anime watchlist of the user
  const animeWatchlist = await Anime.find({ user: req.user.id }).select('-user')

  const statusEnum = {
    Completed: 'Completed',
    Watching: 'Watching',
    OnHold: 'On Hold',
    Unwatched: 'Unwatched',
    Dropped: 'Dropped',
  }

  const completedWatchlistCount = animeWatchlist.filter(
    (anime) => anime.animeStatus === statusEnum.Completed
  ).length
  const watchingWatchlistCount = animeWatchlist.filter(
    (anime) => anime.animeStatus === statusEnum.Watching
  ).length
  const onHoldWatchlistCount = animeWatchlist.filter(
    (anime) => anime.animeStatus === statusEnum.OnHold
  ).length
  const unwatchedWatchlistCount = animeWatchlist.filter(
    (anime) => anime.animeStatus === statusEnum.Unwatched
  ).length
  const droppedWatchlistCount = animeWatchlist.filter(
    (anime) => anime.animeStatus === statusEnum.Dropped
  ).length
  const totalCount = animeWatchlist.length

  return res.status(200).json({
    success: true,
    totalCount,
    completedWatchlistCount,
    watchingWatchlistCount,
    onHoldWatchlistCount,
    unwatchedWatchlistCount,
    droppedWatchlistCount,
  })
})

/*
 * GET /api/v1/features/top-animes/anime/:page/:type/:limit
 * Access - Public
 * Desc - Searches for the top animes (upcoming and airing based on the type)
 */
exports.getTopAnimes = asyncHandler(async (req, res, next) => {
  const { page, type, limit } = req.params

  const endPointToCall = `https://api.jikan.moe/v3/top/anime/${page}/${type}`

  try {
    const { data: { top: topAnimes = [] } = {} } = await axios.get(
      endPointToCall
    )

    return res.status(200).json({
      success: true,
      topAnimes: topAnimes.slice(0, limit),
    })
  } catch (err) {
    return next(new ErrorResponse('Top animes cannot be fetched.', 500))
  }
})

/*
 * GET /api/v1/features/season-animes/anime/year/season
 * Access - Public
 * Desc - Searches for the season animes
 */
exports.getSeasonAnimes = asyncHandler(async (req, res, next) => {
  const { year, season, limit } = req.params

  const endPointToCall = `https://api.jikan.moe/v3/season/${year}/${season}`

  try {
    const { data: { anime: seasonAnimes = [] } = {} } = await axios.get(
      endPointToCall
    )

    return res.status(200).json({
      success: true,
      seasonAnimes: seasonAnimes.slice(0, limit),
    })
  } catch (err) {
    return next(new ErrorResponse('Season animes cannot be fetched.', 500))
  }
})
