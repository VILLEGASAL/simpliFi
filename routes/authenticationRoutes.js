import express from "express";
import { signUpForm, signUpUser, loginForm, homePage, preventAccessIfAuthenticated, logoutUser, checkAuthenticated } from "../controllers/authenticationControllers.js";
import passport from "passport";

export const authenticationRoutes = express.Router();

authenticationRoutes.get("/", preventAccessIfAuthenticated, signUpForm);
authenticationRoutes.post("/signupUser", signUpUser);
authenticationRoutes.get("/login", preventAccessIfAuthenticated,  loginForm);
authenticationRoutes.get("/home", checkAuthenticated, homePage);
authenticationRoutes.post("/login", passport.authenticate('local', {

    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
}));
authenticationRoutes.delete("/logout", logoutUser);
