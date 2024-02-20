const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
* Build inventory by classification view
* **************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
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
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicle Management", 
      nav,
      classificationList,
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
  const classificationList = await utilities.buildClassificationList()
  res.render ("./inventory/addInventory", {
    title: "Add New Car",
    nav,
    errors: null,
    classificationList,
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
  const classificationList = await utilities.buildClassificationList()
  if (newCar) {
      req.flash(
          "notice",
          "Congratulations, new car has been added."
      )
      res.status(201).render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
          classificationList,
          
      })
  } else {
      req.flash("notice", "Sorry, adding the new car failed.")
      res.status(501).render("./inventory/addInventory", {
          title: "Add New Car",
          nav,
          errors: null,
          classificationList,
      })
  } 
}

/* ************************************
* Return Inventory by Classification As JSON
* Unit 5, Select Inv Item Activity
************************************ */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId (classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* *******************************
* Inventory Changes View
* ****************************** */
invCont.getInventoryEdit = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  let nav = await utilities.getNav()
  const invData = await invModel.getDetailsByInventoryId(inv_id)
  const classificationList = await utilities.buildClassificationList(invData.classification_id)
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render ("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id,
    errors: null,
  })
}

/* *******************************
* Inventory Update in database
* ****************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
    )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  
  }
}
/* ***********************
* Build Delete Vehicle View
* *********************** */
invCont.deleteVehicleData = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  let nav = await utilities.getNav()
  const invData = await invModel.getDetailsByInventoryId(inv_id)
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render ("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    
  })
}
  /* *************************
  * Delete Vehicle from Database
  * ************************* */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const 
    {inv_id} = req.body
  const deleteVehicle = await invModel.deleteVehicleData(inv_id);
    if (deleteVehicle) {
      
      req.flash("notice", "The vehicle and data was deleted.")
      res.redirect("/inv/")
    } else {
      const itemName = `${inv_make} ${inv_model}`
      const invData = await invModel.getDetailsByInventoryId(inv_id)
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/delete-confirm", {
        title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: invData.inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_year: invData.inv_year,
    })
  
  }
}
module.exports = invCont