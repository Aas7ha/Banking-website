const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

require('dotenv').config();

const customerRoutes = require("./routes/customer");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,"public")));


mongoose.connect(
    process.env.MONGODB,
    { useNewUrlParser: true, useUnifiedTopology:true}
)
.then((result)=>{
    console.log("DB Connected");
    app.listen(process.env.PORT);
})
.catch((err) => {
    console.log(err)
});


app.use(
    session({
        secret: process.env.SECRET_KEY,
        cookie: { maxAge:6000 },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.use(customerRoutes);



