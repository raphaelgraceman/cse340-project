// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities');
const Validator = require("../utilities/inventory-validator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Vehicle details route
router.get("/detail/:id",  utilities.handleErrors(invController.buildByVehicleId));
//Management view route
router.get("/", utilities.handleErrors(invController.buildInvManagementView));
//addClassification view route
router.get("/add-classification", utilities.handleErrors(invController.addClassificationView ));

//Route to collect add Classification Data
router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClassification)
);

//addInventory view route
router.get("/add-inventory", utilities.handleErrors(invController.addNewInventoryView ));
//Route to post inventory Data
router.post(
  "/add-inventory",
  Validator.inventoryRules(),
  Validator.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

//get classification by id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// Routes to edit inventory items
router.get("/update/:inv_id", utilities.handleErrors(invController.updateInventoryView));

//Route to post inventory Data
router.post("/update/:inv_id", 
  Validator.inventoryRules(), Validator.checkUpdateData, utilities.handleErrors(invController.updateInventory))

router.get("/delete/:id", utilities.handleErrors(invController.deleteInventoryView))

router.post("/inv/delete/:id", utilities.handleErrors(invController.deleteInventory))
module.exports = router;