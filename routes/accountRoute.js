// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build account login by account view
router.get("/type/:accountId", accountController.buildLogin);
router.get("/type/:accountId", accountController.buildRegistration);
router.post('/register', regValidate.registrationRules(), reValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));
//Process the login attempt
router.post(
    "/login",
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router;