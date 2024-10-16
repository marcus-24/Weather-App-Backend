import express, { Application } from "express";
import morgan from "morgan";
import {
  getLocationData,
  getWeatherData,
  getPublicFolderPath,
} from "./utils.js";
import cors from "cors";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8080;
const PUBLIC_FOLDER: string = getPublicFolderPath(); // must be an abs path to serve website

// Use static server to serve the website in the public folder;
app.use(express.static(PUBLIC_FOLDER));

app.use(cors()); // enable cors to commmunicate with frontend

app.use(morgan("dev")); //Add logging for all endpoints

app.get("/cities/:city", getLocationData);

app.get("/cities/:city/weather-data", getWeatherData);

//Add error handler for all endpoints
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
