const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const initDb = require("./utils/InitDB");
const userRoutes = require("./routes/users-routes");
const adminRoutes = require("./routes/admin-routes");
const PORT = 3000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"))
// Routes
app.use("/api/auth", userRoutes);
app.use('/admin',adminRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

