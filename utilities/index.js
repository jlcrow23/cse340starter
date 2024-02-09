const { accountLogin } = require("../controllers/accountController")
const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *************************
* Constructs the nav HTML unordered list
**************************** */
Util.getNav = async function (req,res,next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +='<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* *****************************
 * Build the classification view HTML
 * ************************** */
Util.buildClassificationGrid = async function(data){
    let grid = ""
    if(data.length > 0){
        grid = '<ul class="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="/inv/details/'+ vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model + ' details"><img src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<h2>'
            grid += '<a href="/inv/details/' + vehicle.inv_id +'" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '<hr />'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ***************************
* Build details view
* ***************************/
Util.buildInventoryDetails = async function(data){
    let invDesc = ""
    if(data.length > 0){
        invDesc += '<div class="detailpage">'
        data.forEach(vehicle => {
            invDesc += '<h2>' + vehicle.inv_year + '</h2>'
            invDesc += '<img id="detailsimg" src="' + vehicle.inv_image + '"alt="Image of '+ vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" style="max-width:100%" />'
            invDesc += '<br />'
            invDesc += '<h3 class="detail-price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h3>'
            invDesc += '<section id="inv-details">'
            invDesc += vehicle.inv_description
            invDesc += '<h3 id="detail-miles">Miles: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</h3>'
            invDesc += '</section>'
            
        })
        invDesc += '</div>'
        
    } else {
        invDesc += '<p class="notice">Sorry, no matching description could be found.</p>'
    }
    return invDesc
}

/* ****************************
* Build Form for Login
* ****************************/
Util.buildLoginForm = async function(req,res,next) {
    let logForm = ""
    logForm += '<div class="logform">'
        logForm += '<form id="loginForm" action="/account/login" method="post" >'
        logForm += '<label for="account_email"><b>Email: </b></label><br />'
        logForm += '<input type="email" placeholder="Enter a valid email address" name="account_email" required <%= account.account_email %><br />'
        logForm += '<label for="account_password"><b>Password: </b></label><br />'
        logForm += '<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span><br />'
        logForm += '<input type="password" placeholder="Enter Password" name="account_password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%\^&*()\-_=+[\]{};:\x27.,\x22\\|/?]){12,}"><br />'
        logForm += '<button id="loginbutt" type="submit">LOGIN</button>'
        logForm += '</form>'
        logForm += '</div>'
        return logForm
    }
    
/* *****************************
* Build Registration Form
* *****************************/
Util.buildRegistrationForm = async function(req, res, next) {
    let regForm = ""
    
    regForm += '<div class="register">'
    regForm += '<form action="/account/register" method="post">'
    
    regForm += '<label for="account_firstname"><b>First name</b></label><br />'
    regForm += '<input type="text" name="account_firstname" required value="<%= locals.account_firstname %>"><br>'

    regForm += '<label for="account_lastname"><b>Last name</b></label><br />'
    regForm += '<input type="text" name="account_lastname" required value="<%= locals.account_lastname %>"><br />'

    regForm += '<label for="account_email"><b>Email address</b></label><br />'
    regForm += '<input type="email" name="account_email" required value="<%= locals.account_email %>"><br />'
    
    regForm += '<label for="account_password"><b>Password</b></label><br />'
    regForm += '<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span><br />'
    regForm += '<input type="password" name="account_password" id="pword" required pattern="(?=.*\d)(?=.*[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%\^&*()\-_=+[\]{};:\x27.,\x22\\|/?]){12,}"><br />'

    regForm += '<button id ="registerbutt" type="submit">Register</button>'
    regForm += '</form>'
    regForm += '</div>'

    
    return regForm
}


Util.buildClassificationAdd = async function(req,res,next) {

    let newClass = ""
    newClass += '<form action="./inventory/add-classification" id="addClass">'

    newClass += '<label for="classification_name">Classification: </label>'
    newClass += '<input type="text" placeholder="Classification Name" name="classification_name" required value="<%= locals.classification_name %>" pattern="[a-z][A-Z][0-9](?!.* )">'

    newClass +='<button id="classbutt" type="submit">CREATE</button>'
    newClass ='</form>'

    return newClass
}

Util.buildNewCarForm = async function(req,res,next) {
    let newInv = ""
    newInv += '<form action="./inventory/addInventory" id="addCar">'
    newInv += '<label for="inv_make">Make: </label>'
    newInv += '<input type="text" placeholder="Make" name="inv_make" required <%= inventory.inv_make %> pattern="[a-z][A-Z]" value="Unknown">'
    newInv += '<label for="inv_model">Model: </label>'
    newInv += '<input type="text" placeholder="Model" name="inv_model" required <%= inventory.inv_model %> pattern="[a-z][A-Z][0-9]" value="Unknown">'
    newInv += '<label for="inv_year">Year: </label>'
    newInv += '<input type="number" placeholder="Year" name="inv_year" min="1901" max="2099" step="1" required <%= inventory.inv_year %>  value="Unknown">'
    newInv += '<label for="inv_description">Description: </label>'
    newInv += '<input type="text" placeholder="Description" name="inv_description" required <%= inventory.inv_description %> pattern="[a-z][A-Z][0-9][.\!\-\_]" value="Unknown">'
    newInv += '<label for="inv_image">Image: </label>'
    newInv += '<input type="file" name="inv_image" required <%= inventory.inv_image %> value="../public/images/vehicles/no-image.png">'
    newInv += '<label for="inv_thumbnail">Thumbnail Image: </label>'
    newInv += '<input type="file" name="inv_thumbnail" required <%= inventory.inv_thumbnail %> value="../public/images/vehicles/no-image-tn.png">'
    newInv += '<label for="inv_price">Price: </label>'
    newInv += '<input type="number" placeholder="Price" name="inv_price" min="1" step="any" required <%= inventory.inv_price %> pattern="[0-9]" value="0000">'
    newInv += '<label for="inv_miles">Miles: </label>'
    newInv += '<input type="number" name="inv_miles" required <%= inventory.inv_miles %> value="0000000">'
    newInv += '<label for="inv_color">Color: </label>'
    newInv += '<input type="text" name="inv_color" required <%= inventory.inv_color %> value="Unknown">'
    newInv += '<label for="classification_name">Classification: </label>'
    newInv += '<select name="classification_name" required <%= locals.classification_name %>>'
    newInv += '<option value="Custom">Custom</option>'
    newInv += '<option value="Sport">Sport</option>'
    newInv += '<option value="SUV">SUV</option>'
    newInv += '<option value="Truck">Truck</option>'
    newInv += '<option value="Sedan">Sedan</option></select>'

    return newInv
}

/* *******************************
* Middleware For Handling Errors
* Wrap other function in this for
* Genereal Error Handling
********************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* *******************************
 * Middleware to check token validity
 *********************************/
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

module.exports = Util