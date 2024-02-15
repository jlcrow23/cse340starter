// const { accountLogin } = require("../controllers/accountController")
const invModel = require("../models/inventory-model")
const Util = {}
// const jwt = require("jsonwebtoken")
// require("dotenv").config()

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

Util.buildClassificationList = async function (req,res,next) {
    let data = await invModel.getClassifications()
    let list = '<select id="optionsList" name="classification_name" required>'
    
    data.rows.forEach((row) => {
        list += "<option>"
        list += '<option value="' + row.classification_name + '">' + row.classification_name +  '</option>'
    })
    list += "</select>"
    return list
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