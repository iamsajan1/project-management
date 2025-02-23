import express, {Request, Response} from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
/*ROUTES IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
 import userRoutes from "./routes/userRoutes";
 import teamRoutes from "./routes/teamRoutes";
 import { PrismaClient } from "@prisma/client";
/*CONFIGRATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/*ROUTES   */
app.get("/", (req, res) => {
  res.send("this is home routes!");
});
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);


/*SERVER */
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0",() => {
  console.log(`server is running on port ${port}`);
});
