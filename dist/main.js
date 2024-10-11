import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import axios from "axios";
function getPublicFolder() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return path.join(__dirname, "..", "public");
}
async function get_location_data(req, res, next) { }
const app = express();
const PORT = Number(process.env.PORT) || 8080;
const PUBLIC_FOLDER = getPublicFolder(); // must be an abs path to serve website
const API_KEY = process.env.API_KEY;
// Use static server to serve the website in the public folder;
app.use(express.static(PUBLIC_FOLDER));
app.use(morgan("dev")); //Add logging for all endpoints
app.get("/weather-locs/:city", async (req, res, next) => {
    const city = req.params.city;
    try {
        const response = await axios.get(`https://geocode.maps.co/search?q=${city}&api_key=${API_KEY}`);
        res.status(response.status).send(response.data);
    }
    catch (err) {
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
//# sourceMappingURL=main.js.map