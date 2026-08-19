require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./database/db");
const userRoutes = require("./routes/user.route.js");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes.js");

connectDB();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
