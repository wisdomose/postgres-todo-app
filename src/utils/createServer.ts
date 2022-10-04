import express from "express";
import { routes } from "./routes";

// export async function createServer() {
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

export { app };
// }
