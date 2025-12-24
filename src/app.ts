import cookieParser from "cookie-parser";
import express, { Application } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
import { applySecurity } from "./middleware/security";
import router from "./router";
import corsModule from "cors";

const app: Application = express();

// applySecurity(app);

app.use(express.json());
app.use(express.static("public"));

app.use(corsModule());
app.use(cookieParser());

applySecurity(app);

app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.send("Hey there! Welcome to our API.");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;

function cors(): any {
  throw new Error("Function not implemented.");
}

