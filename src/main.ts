import express, { Application, response } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import axios from "axios";

function getPublicFolder(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return path.join(__dirname, "..", "public");
}

async function get_location_data(req, res, next) {}

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8080;
const PUBLIC_FOLDER: string = getPublicFolder(); // must be an abs path to serve website
const API_KEY: string = process.env.API_KEY;

// Use static server to serve the website in the public folder;
app.use(express.static(PUBLIC_FOLDER));

app.use(morgan("dev")); //Add logging for all endpoints

app.get("/weather-locs/:city", async (req, res, next) => {
  const city: string = req.params.city;
  try {
    const response = await axios.get(
      `https://geocode.maps.co/search?q=${city}&api_key=${API_KEY}`
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    next(err);
  }
});

//Add error handler for all endpoints
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
