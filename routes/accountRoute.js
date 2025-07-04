// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities");
const accountController = require('../controllers/accountController');
const registrationValidate = require('../utilities/account-validation');
const authenticated = require("../middlewares/authMiddleware");

//Login view route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Account Management view route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagementView))

//Registration view route
router.get("/register", utilities.handleErrors(accountController.buildRegistrationView));
// Process the registration data
router.post(
  "/register",
  registrationValidate.registrationRules(),
  registrationValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login request
router.post(
  "/login",
  registrationValidate.loginRules(),
  registrationValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route for Admins Only
router.get(
  "/adminDashboard",
  utilities.checkAccountTypeIsAdmin,
  utilities.handleErrors(accountController.getAdminDashboard)
);
// Route for Admins and Employees
router.get(
  "/employeeDashboard",
  utilities.checkAccountTypeIsEmployee,
  utilities.handleErrors(accountController.getEmployeeDashboard)
);

// Route for all Users
router.get(
  "/userDashboard",
  utilities.checkAccountTypeIsUser,
  utilities.handleErrors( accountController.getUserDashboard)
);

// Route for Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.getLogOutView)
);

// Delete Route
router.get(
  "/delete",
  utilities.handleErrors(accountController.deleteAccountView)
);

// Update Route
router.get(
  "/update",
  utilities.handleErrors(accountController.updateAccountView)
);


module.exports = router;