const express = require('express');
const flash = require('connect-flash');
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Connection failed:', error);
    process.exit(1);
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser('keyboardcat'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true, 
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  if (!req.isAuthenticated() && req.path !== '/login') {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});


app.get("/",(req,res)=>{
  res.render("products/homePage");
})

const productRoutes = require("./routes/productRoutes"); 
const reviewRoutes = require("./routes/reviewRoutes");  
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/products", productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

const productController = require('./controllers/productController');

const {isLoggedIn}=require("./middleware");

app.get("/", productController.getHomePage);
app.post('/:IDD/create-checkout-session', isLoggedIn, productController.createCheckoutSession);



require('./config/passport');

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

