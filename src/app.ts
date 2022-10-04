import { app } from "./utils/createServer";
import "dotenv/config";
// import { connectDB } from "./utils/db";

async function startServer() {
  // const app = await createServer();

  // connectDB();

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

startServer();
