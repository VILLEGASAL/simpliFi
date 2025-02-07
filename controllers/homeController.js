import { System } from "../model/dbQueries.js";

export const addTransaction = async(req, res) => {

    try {
        
        const userID = req.user.user_id;
        const category = req.body["category"];
        const transType = req.body["transtype"];
        const amount = req.body["amount"];

        if (transType === "expense" && amount > await System.getUserBalance(req.user.user_id)) {

            res.redirect("/home?error=Insufficient Balance");
            
        }else{

            await System.updateUserBalance(userID, transType, amount, category);

            res.redirect("/home");
        }
        
    } catch (error) {
        
    }
}

export const deleteTransaction = async(req, res) => {

    try {

        const trans_id = req.body["trans_id"];

        await System.removeTransaction(trans_id, req.user.user_id);
        
        
        res.redirect("/home");
        
    } catch (error) {
        
    }
}