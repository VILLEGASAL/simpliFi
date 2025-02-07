import { System } from "../model/dbQueries.js";


export const signUpForm = (req, res) => {
    
    res.render("signup.ejs");
};

export const signUpUser = async (req, res) => {

    try {

        const fName = req.body["fName"];
        const lName = req.body["lName"];
        const email = req.body["email"];
        const password = req.body["password"];

        console.log("SIGN");
        

        const process = await System.signupUser(fName, lName, email, password, 0.0, 0.0, 0.0);

        res.status(201).redirect("/login");

    } catch (error) {
        
        res.status(409).json({

            message: "Duplicate"
        });
    }
};

export const preventAccessIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/home");
    }
    // Set headers to prevent caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
};

export const checkAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {
        
        return next();
        
    }

    res.redirect("/login");
}

export const loginForm = (req, res) => {

    res.render("login.ejs");
}

export const homePage = async(req, res) => {

    try {

        const userBalance = await System.getUserBalance(req.user.user_id);
        const userTotalIncome = await System.getUserTotalIncome(req.user.user_id);
        const userTotalExpense = await System.getUserTotalExpense(req.user.user_id);
        const userTransactions = await System.getAllTransactions(req.user.user_id);

        res.render("home.ejs", 
            { 
                userName: req.user.first_name, 
                balance: userBalance,
                income: userTotalIncome,
                expense: userTotalExpense,
                error: req.query.error,
                transactions: userTransactions
            });

    } catch (error) {
        
    }
    
    
}

export const logoutUser = (req, res) => {

    req.logOut(() => {

        req.session.destroy(() => {

            res.redirect("/login");

        });
    
    });
}






