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
    let nav = await utilities.getNav()
    const data = await invModel.getInventoryByClassificationId()
    const grid = await utilities.buildClassificationGrid(data)
    res.render("./inventory/management", {
      title: "Vehicle Management", 
      nav,
      grid,
      errors: null, 
      
    })
  }

  /* *********************************
   * New Class Page Build
   * *********************************/
  invCont.buildNewClass = async function(req, res, next) {
    let nav = await utilities.getNav()
    const data = await invModel.getInventoryByClassificationId()
    const grid = await utilities.buildClassificationGrid(data)
    res.render ("./inventory/add-classification", {
      title: "New Classification",
      nav,
      grid,
      errors: null,
    })
  }

  /* **************************
  * New Car Add page Build
  * **************************/
 invCont.buildInventoryPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const list = await utilities.buildClassificationList()
  res.render ("./inventory/addInventory", {
    title: "Add New Car",
    nav,
    list,
    errors: null,
  })
 }

  /* ***************************
  * Add Classification to Database
  * *************************** */
 invCont.addClassification = async function(req, res, next) { 
  const {classification_name} = req.body 
  const newClass = await invModel.addClassificationName(classification_name);
  let nav = await utilities.getNav();
  if (newClass) {
      req.flash(
          "notice",
          `Congratulations, new classification of ${classification_name} added.`
      )
      res.status(201).render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
      })
  } else {
      req.flash("notice", "Sorry, the new classification failed.")
      res.status(501).render("./inventory/add-classification", {
          title: "New Classification",
          nav,
          errors: null,
      })
  } 
}


 /* **************************
  * Add New Car to database
  * **************************/

 invCont.addCarToDatabase = async function (req, res, next) {
    const {

    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_name

  } = req.body
  
  const newCar = await invModel.addNewCar(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_name
    );

  let nav = await utilities.getNav()
  
  if (newCar) {
      req.flash(
          "notice",
          "Congratulations, new car has been added."
      )
      res.status(201).render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
      })
  } else {
      req.flash("notice", "Sorry, adding the new car failed.")
      res.status(501).render("./inventory/addInventory", {
          title: "Add New Car",
          nav,
          errors: null,
      })
  } 
}

module.exports = invCont