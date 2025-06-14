// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities');
const accountController =require('../controllers/accountController')
const registrationValidate = require('../utilities/account-validation')

//Login view route
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//Registration view route
router.get("/register", utilities.handleErrors(accountController.buildRegistrationView));
// Process the registration data
router.post(
  "/register",
  registrationValidate.registrationRules(),
  registrationValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
)
module.exports = router;