// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")

// Route to build account login by account view
router.get("/type/:accountId", accountController.buildLogin);

module.exports = router;