const invModel = require("../models/inventory-model")
const Util = {}

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
        logForm += '<form action="./../../controllers/accountController.ejs" method="post" id="loginForm">'
        logForm += '<label for="account_email"><b>Email: </b></label><br />'
        logForm += '<input type="email" placeholder="Enter Email Address" name="account_email" require <%= account.account_email %><br />'
        logForm += '<label for="account_password"><b>Password: </b></label><br />'
        logForm += '<input type="password" placeholder="Enter Password" name="account_password" require><br />'
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
    
    regForm += '<div class="register"></div>'
    regForm += '<form action="/account/register" method="post">'
    
    regForm += '<label for="account_firstname"><b>First name</b></label><br />'
    regForm += '<input type="text" name="account_firstname" required <%= account.account_firstname %><br>'

    regForm += '<label for="account_lastname"><b>Last name</b></label><br />'
    regForm += '<input type="text" name="account_lastname" required <%= account.account_lastname %><br />'

    regForm += '<label for="account_email"><b>Email address</b></label><br />'
    regForm += '<input type="email" name="account_email" required <%= account.account_email %><br />'

    regForm += '<label for="account_password"><b>Password</b></label><br />'
    regForm += '<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span>'
    regForm += '<input type="password" name="account_password" id="pword" required pattern="(?=.*\d)(?=.*[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%\^&*()\-_=+[\]{};:\x27.,\x22\\|/?]){12,}"><br />'

    regForm += '<button id ="registerbutt" type="submit">Register</button>'
    regForm += '</form>'
    regForm += '</div>'

    
    return regForm
    // const registerbutt = document.querySelector("#registerbutt");
    //     registerbutt.addEventListener("Click", function(){
    //         const regInput = document.getElementById("pword");
    //         const type = regInput.getAttribute("type");
    //         if (type == "password"){
    //             regInput.setAttribute("type", "text");
    //             registerbutt.innerHTML = "Hide Password";
    //         } else {
    //             regInput.setAttribute("type", "password");
    //             registerbutt.innerHTML = "Show Password";
    //         }
    //     })
}


/* *******************************
* Middleware For Handling Errors
* Wrap other function in this for
* Genereal Error Handling
********************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util