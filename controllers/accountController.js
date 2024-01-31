const utilities = require("../utilities/")
const accountController = {}

/* ***************************
 * Deliver login view
 **************************** */
accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./views/account/login", {
        title: "Login",
        nav,
    })
}

module.exports = accountController