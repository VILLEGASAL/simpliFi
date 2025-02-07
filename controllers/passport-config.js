import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import { System } from "../model/dbQueries.js";


export const initialize = (passport) => {

    const authenticateUser = async(email, password, done) => {

        try {

            const user = await System.getUserByEmail(email);
            

            if (user === null) {
                
                return done(null, false, { message: "No user with that email." });
            }

            if(await bcrypt.compare(password, user.password)){

                return done(null, user);
            }else{

                return done(null, false, { message: "Password incorrect!" });
            }
            
        } catch (error) {
            console.log("May error");
            
            
            return done(error);
        }
    }

    passport.use(new Strategy({ usernameField: "email", passwordField: "password" }, authenticateUser));

    passport.serializeUser((user, done) => {

       return done(null, user.user_id);
    });

    passport.deserializeUser(async (id, done) => {

        return done(null, await System.getUserById(id));
    });
}