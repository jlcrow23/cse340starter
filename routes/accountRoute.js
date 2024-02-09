// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Access account management view
router.get("/", utilities.handleErrors(accountController.accountLogin));
// Route to build account login by account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build account registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));
// Process Registration
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));
//Process the login attempt
router.post(
    "/login/",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;