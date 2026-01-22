import express from "express";
import routes from "./routes.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.listen(port, () => {
  console.log(`server berjalan di : http://${host}:${port}`);
});
