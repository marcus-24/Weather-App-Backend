import { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const API_KEY: string = process.env.API_KEY;

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
      `https://geocode.maps.co/search?q=${city}&api_key=${API_KEY}`
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    next(err);
  }
}
