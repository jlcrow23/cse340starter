const utilities = require("../utilities/")
const acctModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ***************************
 * Deliver login view
 **************************** */
async function buildLogin (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
        
    })
    // const account_email = await acctModel.checkExistingEmail(account_email)
}
/* ****************************
 * Registration View
 * *************************** */
async function buildRegistration (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/registration", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ***************************
* Process Registration
* ***************************/
async function registerAccount (req, res, next) {
    let nav = await utilities.getNav()
    const { 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password,
    } = req.body    

    // Hash the password before storing
    let hashedPassword
    try {
        //regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash(
            "notice",
            "Sorry, there was an error processing the registration."
        )
        res.status(500).render("./account/registration", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
    // const logForm = await utilities.buildLoginForm();
    const regResult = await acctModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    )

    
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("./account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("./account/registration", {
            title: "Registration",
            nav,
            errors: null,
        })
    } 
} 

/* ************************************
* Build Management Page
* *********************************** */
async function buildAcctManagement (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
     const { account_email, account_password } = req.body
     const accountData = await acctModel.getAccountByEmail(account_email)
     if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
        account_email,
     })
    return
    }
     try {
    //  const passTest = await bcrypt.compare(account_password, accountData.account_password)
        if (await bcrypt.compare(account_password, accountData.accout_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     return res.redirect("./account/")
        } 
    } catch (error) {
     return new Error('Access Forbidden')
    }
   }
   

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAcctManagement }