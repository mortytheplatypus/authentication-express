const express = require("express");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Set EJS as the view engine
app.set("view engine", "ejs");

// database connection
const dbURI = "mongodb+srv://morty:12password34@cluster0.htfuaqt.mongodb.net/node-auth"

mongoose.connect(dbURI)
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));

// useNewUrlParser , useUnifiedTopology , useFindAndModify , and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// routes
app.get("*", checkUser);
app.get("/", (req, res) => { res.render("home"); });
app.get("/smoothies", requireAuth, (req, res) => { res.render("smoothies"); });
app.use(authRoutes);



