const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
* Build inventory by classification view
* **************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles", 
        nav, 
        grid,
    })
}

/* ******************************
* Build inventory by details view
* ******************************/
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId;
    const data = await invModel.getInventoryByClassificationId(inv_id);
    const invDesc = await utilities.buildInventoryDetails(data);
    let nav = await utilities.getNav();
    const model = data[0].inv_model;
    const make = data[0].inv_make;
      
    res.render("./inventory/details", {
      title: make + " " + model,
      invDesc,
      nav,
    });
    // } else {
    //   const err = new Error("Not Found");
    //   err.status = 404;
    //   next(err);
    // }
  }

module.exports = invCont