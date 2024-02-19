// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// vehilce details route
router.get("/details/:inventoryId", invController.buildByInventoryId);
// build vehicle management page
router.get("/management", invController.buildManagementPage)
// add class route
router.get("/add-classification", invController.buildNewClass)
// add vehicle route
router.get("/addInventory", invController.buildInventoryPage)
// vehicle inventory modification route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// vehicle edit route
router.get("/edit/:inventory_id", utilities.handleErrors(invController.getInventoryEdit))
//Process New Classification
router.post(
    "/newClassAdd",  
    utilities.handleErrors(invController.addClassification)
);

//Process the add car attempt
router.post(
    "/newCarAdd",
    // invValidate.inventoryAddRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addCarToDatabase)
);
//Process vehicle update
router.post(
    "/update",
    // invValidate.inventoryAddRules(),
    invValidate.checkUpdateInventoryData,
    utilities.handleErrors(invController.updateInventory)
);
module.exports = router;