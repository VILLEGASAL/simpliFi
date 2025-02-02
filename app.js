import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import flash from "express-flash";
import methodOverride from "method-override";
import { authenticationRoutes } from "./routes/authenticationRoutes.js";
import { homeRoutes } from "./routes/homeRoutes.js";
import { initialize } from "./controllers/passport-config.js";


const app = express();
const PORT = 5000;

initialize(passport);

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))


app.use(session({

    secret: "HELLO_WORLD!284655",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/home", homeRoutes);
app.use("/", authenticationRoutes);


//Views
app.set("view engine", "ejs");

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}.`);
});