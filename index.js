const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const initDb = require("./utils/InitDB");
const userRoutes = require("./routes/users-routes");
const adminRoutes = require("./routes/admin-routes");
const historyRoutes = require("./routes/history-routes");
const walletRoutes = require("./routes/wallet-routes");
const PORT = 3000;
const app = express();

const cookieParser = require("cookie-parser");


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"))
// Routes
app.use("/api/auth", userRoutes);
app.use('/admin',adminRoutes);
app.use("/history",historyRoutes);
app.use("/wallet",walletRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

