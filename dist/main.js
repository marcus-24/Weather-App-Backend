import express from "express";
import morgan from "morgan";
import { getLocationData, getPublicFolderPath } from "./utils.js";
const app = express();
const PORT = Number(process.env.PORT) || 8080;
const PUBLIC_FOLDER = getPublicFolderPath(); // must be an abs path to serve website
// Use static server to serve the website in the public folder;
app.use(express.static(PUBLIC_FOLDER));
app.use(morgan("dev")); //Add logging for all endpoints
app.get("/weather-locs/:city", getLocationData);
//Add error handler for all endpoints
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
});
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
//# sourceMappingURL=main.js.map