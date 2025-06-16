const utilities = require(".")
const { body, validationResult } = require("express-validator");
const validate = {}

//Classification validation rules
validate.classificationRules = () => {
   return [ body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Please provide a classification name.")]
}

/* ******************************
 * Classification validation Checks
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
  const {classification_name }= req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("/inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}


/*  **********************************
*  Add New Inventory Validation Rules
* ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a name."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide the model."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() 
        .withMessage("Please inventory description."),

       body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2000 })
        .withMessage("Please provide the price."),

       body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage("Please provide the year."),

       body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10000 })
        .withMessage("Please provide a mileage.")
        
    ]
}



/* ******************************
 * Inventory Data Checks
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_year,
      inv_miles,
    })
    return
  }
  next()
}







//implementing validation logic for inventory item
validate.validateInventory = async (req, res, next) =>{
    const { inv_make, inv_model, classification_id } = req.body;

    // Basic validation checks
    if (!inv_make || !inv_model || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/inv/add-inventory'); // Redirect back to the form
    }
    next(); // Proceed to the controller if validation passes
}


//implementing validation to direct errors to the edit view
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, classification_id } = req.body;

    // Basic validation checks
    if (!inv_id || !inv_make || !inv_model || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/inv/edit-inventory'); // Redirect back to the form
    }

    next(); // Proceed to the controller if validation passes
}




module.exports = validate