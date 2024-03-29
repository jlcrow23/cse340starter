/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const invCont = require("./controllers/invController")
const utilities = require("./utilities/")
const flash = require("connect-flash")
const session = require("express-session")
const pool = require('./database/')
const accountController = require("./controllers/accountController")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()

/* *******************************
 * Middleware
 * ******************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// BodyParser available
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true})) // for parsing application/x-www-form-urlencoded

// cookieParser available
app.use(cookieParser())

// check validity
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
/* app.use(express.static("public"));*/
app.use("/public", express.static("public"))
app.set("layout", "./layouts/layout") // not at views root
// Route to build login view
app.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route for Processing Login
app.get("/account", utilities.handleErrors(accountController.buildAcctManagement))
// Route for registration view
app.get("/registration", utilities.handleErrors(accountController.buildRegistration))
// Route for process registration
app.get("/register", utilities.handleErrors(accountController.registerAccount))
// Route for Inventory Management view
app.get("/management", utilities.handleErrors(invCont.buildManagementPage))
// Route for Add Class View
app.get("/add-classification", utilities.handleErrors(invCont.buildNewClass))
// Route to add Class to database
app.get("/newClassAdd", utilities.handleErrors(invCont.addClassification))
// Route for Add Inventory View
app.get("/addInventory", utilities.handleErrors(invCont.buildInventoryPage))
// Route to Add Car to database
app.get("/newCarAdd", utilities.handleErrors(invCont.addCarToDatabase))




/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory Routes
app.use("/inv", require("./routes/inventoryRoute"), utilities.handleErrors(inventoryRoute))
// Account Routes
app.use("/account", require("./routes/accountRoute"), utilities.handleErrors(accountRoute))
app.use("/inventory", require("./routes/inventoryRoute"), utilities.handleErrors(inventoryRoute))
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have gotten lost.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
************************** */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
