// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const Util = require("../utilities/")

//Access account management view
router.get("/management", utilities.checkLogin, utilities.handleErrors(accountController.buildAcctManagement));
// Route to build account login by account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build account registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
// Route to build account update view
router.get("/update-view", utilities.handleErrors(accountController.buildUpdateView))
// Process Registration
router.post(
    "/register", 
    regValidate.registrationRules(), 
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
);

//Process the login attempt
router.post(
    "/loggedin",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;