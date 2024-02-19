// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/details/:inventoryId", invController.buildByInventoryId);
router.get("/management", invController.buildManagementPage)
router.get("/add-classification", invController.buildNewClass)
router.get("/addInventory", invController.buildInventoryPage)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Process New Classification
router.post(
    "/newClassAdd",  
    utilities.handleErrors(invController.addClassification)
);

//Process the login attempt
router.post(
    "/newCarAdd",
    utilities.handleErrors(invController.addCarToDatabase)
);

module.exports = router;