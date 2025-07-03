import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import suggestionRoutes from "./Routers/SmartSuggestions.js";

dotenv.config({ path: "./config/config.env" });
const app = express();

const port = process.env.PORT || 5000;
connectDB();

// ✅ Use this for dynamic origin checking
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://finance-tracker-ten-zeta.vercel.app", // ✅ your frontend Vercel URL
  "https://finance-tracker-1-yj2r.onrender.com", // ✅ your backend live URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Security and parsing middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Routes
app.use("/api/smart", suggestionRoutes);
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello from backend 👋");
});

// ✅ Error handler for CORS rejections (optional)
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ message: "CORS Error: Origin not allowed." });
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
