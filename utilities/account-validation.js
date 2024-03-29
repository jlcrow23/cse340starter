const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* *****************************
* Registration Data Validation Rules
* *****************************/
validate.registrationRules = () => {
    return [
        // firstname is required and must be a string
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent

        //lastname is required and must be a string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("please provide a last name."), 

        //valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}

/* *******************************
* Check data and return errrors or continue to registration
* *******************************/
validate.checkRegData = async (req, res, next) => {
    const { 
        account_firstname, 
        account_lastname, 
        account_email 
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("/account/registration", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* *****************************
* Login Validation
* ******************************/
//valid email is required must already exist in the DB
validate.loginRules = () => {
    return [
        body("account_email")
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                return
            } else {
                throw new Error("Please log in with a valid email or register.")
            }
        }),

        // password is required and must be strong
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Please enter a valid password.")
    ]
}

//valid login data
validate.checkLoginData = async (req, res, next) => {
    const { 
        account_email, 
        account_password,
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
            account_password,
        })
        return
    }
    next()
}


module.exports = validate