// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities');
const { validateInventory, checkUpdateData } = require('../utilities/inventory-validator');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Vehicle details route
router.get("/detail/:id",  utilities.handleErrors(invController.buildByVehicleId));

module.exports = router;