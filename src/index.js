import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 4000;

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

app.use("/", routes);