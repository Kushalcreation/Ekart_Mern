require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./database/db");
const userRoutes = require("./routes/user.route.js");

connectDB();
const PORT = process.env.PORT;

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
