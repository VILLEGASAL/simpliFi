import bcrypt from "bcrypt";
import { db } from "./dbConnection.js";

db.connect();

export class System {

    static async getUsers(){

        try {

            return await db.query("SELECT * FROM users");
            
        } catch (error) {
            
            console.log(error);
            
        }
    }

    static async signupUser(fName, lName, email, password, balance, income, expense){

        try {

            const hashPassword = await bcrypt.hash(password, 10);
            
            await db.query(

                `INSERT INTO users (first_name, last_name, email, password, balance, total_income, total_expense)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`, [fName, lName, email, hashPassword, balance, income, expense] 
            );
            
        } catch (error) {
            
            console.log(error);
            
            return error
        }
    }

    static async getUserByEmail(email) {

        try {
            
            const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

            return user.rows[0] || null;
    
        } catch (error) {
            
        }
    }

    static async getUserById(id){

        try {
            
            const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [id]);

            return user.rows[0] || null;
    
        } catch (error) {
            
        }
    }

    static async getUserBalance(user_id){

        try {
            
            const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
            
            return user.rows[0].balance;

        } catch (error) {
            
        }
    } 

    static async getUserTotalIncome(user_id){

        try {
            
            const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);

            return Number(user.rows[0].total_income);

        } catch (error) {
            
        }
    } 

    static async getUserTotalExpense(user_id){

        try {
            
            const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
            
            return Number(user.rows[0].total_expense);

        } catch (error) {
            
        }
    } 

    static async #addTransaction(user_id, transType, amount, category){

        try {
            
            const process = await db.query(`INSERT INTO transactions (user_id, transaction_type, amount, category)
                VALUES ($1, $2, $3, $4)`, [user_id, transType, amount, category]);
            
        } catch (error) {
            
        }
    }

    static async updateUserBalance(user_id, transType, amount, category){
        
        try {
            
            if (transType === "expense") {

                const updateBal = await this.getUserBalance(user_id) - Number(amount);
                const updateExp = await this.updateUserTotalExpense(user_id, amount);

                await db.query(`

                    UPDATE users SET balance = $1 WHERE user_id = $2
                    `, [updateBal, user_id]);

                await this.#addTransaction(user_id, transType, amount, category);

            }else{

                const updateBal = await this.getUserBalance(user_id) + Number(amount);
                const updateInc = await this.updateUserTotalIncome(user_id, amount);
                
                await db.query(`

                    UPDATE users SET balance = $1 WHERE user_id = $2
                    `, [updateBal, user_id]);

                await this.#addTransaction(user_id, transType, amount, category);
            }

        } catch (error) {
            
        }
    }

    static async updateUserTotalIncome(user_id, amount){
        
        try {
            
            const userNewIncome = await this.getUserTotalIncome(user_id) + Number(amount);
        
            await db.query(`

                UPDATE users SET total_income = $1 WHERE user_id = $2
                `, [userNewIncome, user_id]);
            

        } catch (error) {
            
            console.log(error);
            
        }
    }

    static async updateUserTotalExpense(user_id, amount){
        
        try {
             
            const userNewExpense = await this.getUserTotalExpense(user_id) + Number(amount);
        
            await db.query(`

                UPDATE users SET total_expense = $1 WHERE user_id = $2
                `, [userNewExpense, user_id]);

        } catch (error) {
            
            console.log(error);
            
        }
    }

    static async getAllTransactions(user_id){

        try {

            const transactions = await db.query(`SELECT * FROM transactions WHERE user_id = $1`, [user_id]);

            return transactions.rows;
            
        } catch (error) {
            
        }
    }

    static async #getSpecifictransaction(trans_id){

        try {

            const transaction = await db.query(`SELECT * FROM transactions WHERE trans_id = $1`, [trans_id]);

            return transaction.rows[0];
            
        } catch (error) {
            
        }
    }

    static async removeTransaction(trans_id, user_id){

        try {

            const transaction = await this.#getSpecifictransaction(trans_id);

            if (transaction.transaction_type === "income") {

                const updateInc = Number(await this.getUserTotalIncome(user_id)) - Number(transaction.amount);
                const updateBal = Number(await this.getUserBalance(user_id)) - Number(transaction.amount);

                if(Number(await this.getUserBalance(user_id)) < Number(transaction.amount)){

                    if (await this.getUserTotalIncome(user_id) < Number(transaction.amount)) {
                    
                        await db.query(`
    
                            UPDATE users SET total_income = $1 WHERE user_id = $2
                            `, [0, user_id]);
        
                        await db.query(`
        
                            UPDATE users SET balance = $1 WHERE user_id = $2
                            `, [updateBal, user_id]);
                    }else{

                        await db.query(`
    
                            UPDATE users SET total_income = $1 WHERE user_id = $2
                            `, [updateInc, user_id]);
        
                        await db.query(`
        
                            UPDATE users SET balance = $1 WHERE user_id = $2
                            `, [0, user_id]);
        
                    }

                }else{

                    if (await this.getUserTotalIncome(user_id) < Number(transaction.amount)) {
                    
                        await db.query(`
    
                            UPDATE users SET total_income = $1 WHERE user_id = $2
                            `, [0, user_id]);
        
                        await db.query(`
        
                            UPDATE users SET balance = $1 WHERE user_id = $2
                            `, [updateBal, user_id]);
                    }else{

                        await db.query(`
    
                            UPDATE users SET total_income = $1 WHERE user_id = $2
                            `, [updateInc, user_id]);
        
                        await db.query(`
        
                            UPDATE users SET balance = $1 WHERE user_id = $2
                            `, [updateBal, user_id]);
                    }
    
                }

            } else {

                const updateExp = Number(await this.getUserTotalExpense(user_id)) - Number(transaction.amount);
                const updateBal = Number(await this.getUserBalance(user_id)) + Number(transaction.amount);

                await db.query(`
    
                    UPDATE users SET total_expense = $1 WHERE user_id = $2
                    `, [updateExp, user_id]);

                await db.query(`

                    UPDATE users SET balance = $1 WHERE user_id = $2
                    `, [updateBal, user_id]);
            }
            
            await db.query('DELETE FROM transactions WHERE trans_id = $1', [trans_id]);
    
        } catch (error) {
            
        }

    }
}