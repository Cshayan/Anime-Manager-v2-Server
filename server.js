/* Entry Point to backend-server */

/* Import dependencies */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const errorHandler = require("./middleware/errorHandler");

// Route files
const authRoute = require("./routes/api/v1/auth/authRoute");
const animeRoute = require("./routes/api/v1/features/animeRoute");

// ENV file loader
dotenv.config({ path: "./config/secret.env" });

// Connect to DB
const connectToDB = require("./config/db");
connectToDB();

// Express
const app = express();

// Some middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Security purpose
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());

/* Route Settings */
app.get("/", (req, res) =>
  res.send("Anime Manager Backend API running in PROD.")
);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/features", animeRoute);

// Error Handler
app.use(errorHandler);

// Listen to server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode in port ${PORT}`.yellow.bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err}`.red.bold);
  server.close(() => process.exit(1));
});
