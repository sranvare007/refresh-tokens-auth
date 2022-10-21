import { Logger } from "./utils/logger.utils";
import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  Logger.info(`[SERVER]: Listening on port ${PORT}`);
});
