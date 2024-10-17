import { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios, { AxiosResponse } from "axios";

const API_KEY: string = process.env.API_KEY;
const LOCATION_URL: string = "https://geocode.maps.co/search";
const WEATHER_URL: string = "https://api.weather.gov/points";

export function getPublicFolderPath(): string {
  const __filename = fileURLToPath(import.meta.url); //abs path to filename
  const __dirname = dirname(__filename); //abs path to directory
  return path.join(__dirname, "..", "public");
}

export async function getLocationData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const city: string = req.params.city;
  try {
    const response = await axios.get(
      `${LOCATION_URL}?q=${city}&api_key=${API_KEY}`
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    next(err);
  }
}

export function getWeatherData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const city: string = req.params.city;
  axios
    .get(`${LOCATION_URL}?q=${city}&api_key=${API_KEY}`)
    .then((resp) => {
      const top_match = resp.data[0];
      return `${WEATHER_URL}/${top_match["lat"]},${top_match["lon"]}`;
    })
    .then((url) => {
      return axios.get(url);
    })
    .then((resp) => {
      const forecast_url = resp.data["properties"]["forecast"];
      return axios.get(forecast_url);
    })
    .then((resp) => {
      res.status(resp.status).send(resp.data["properties"]["periods"]);
    })
    .catch((err) => {
      next(err);
    });
}
