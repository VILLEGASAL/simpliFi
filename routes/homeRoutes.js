import express from "express";
import { checkAuthenticated } from "../controllers/authenticationControllers.js";
import { addTransaction, deleteTransaction } from "../controllers/homeController.js";


export const homeRoutes = express.Router();


homeRoutes.post("/addTransaction", checkAuthenticated, addTransaction);
homeRoutes.delete("/deleteTransaction", checkAuthenticated, deleteTransaction);

