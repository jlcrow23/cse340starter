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
    const data = await invModel.getDetailsByInventoryId(inv_id);
    const invDesc = await utilities.buildInventoryDetails(data);
    if(data.length > 0) {
      const grid = await utilities.buildClassificationGrid(data);
      let nav = await utilities.getNav();
      const make = data[0].inv_make;
      const model = data[0].inv_model;
      res.render("./inventory/details", {
        title: make + " " + model,
        invDesc,
        grid,
        nav,
    });
    } else {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    }
  }

  /* ***************************
   *  Management Page Build
   * ***************************/
  invCont.buildManagementPage = async function(req, res, next) {
    // const managePage = 
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Inventory Management", 
      nav, 
      grid,
    })
  }

  /* ***************************
  * Add Classification to Database
  * *************************** */
 invCont.addClassification = async function(req, res, next) {
    const classification_id = req.params.classificationId;
    const newClass = await utilities.buildClassificationAdd(classification_id)
    const data = await invModel.addClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    
    res.render("./inventory/newClass", {
      title: "Classification Added",
      newClass,
      grid,
      nav,
    })
 }

 /* **************************
  * Add New Car to database
  * **************************/

 invCont.addCarToDatabase = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const newCar = await utilities.addCarToDatabase(inv_id)
  if(newCar.length > 0) {
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const make = data[0].inv_make;
    const model = data[0].inv_model;
    res.render("./inventory/carAdded", {
      title: "New Car Added",
      newCar,
      grid,
      nav,
  });
  } else {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
}

module.exports = invCont