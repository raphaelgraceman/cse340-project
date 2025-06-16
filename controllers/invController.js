const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
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

/* ***************************
 *  Vehicle details
 * ************************** */
invCont.buildByVehicleId = async (req, res) => {
  const vehicle_id = req.params.id;
  const vehicleInfo = await invModel.getByVehicleId(vehicle_id);
  const vehicleHtml = utilities.buildVehicleDetailsGrid(vehicleInfo);
  let nav = await utilities.getNav()
  res.render("./inventory/vehicleDetails", {
    title: " Vehicles",
    nav,
    vehicleHtml,
    errors: null
  })
}

/* ****************************************
*  Deliver Inv Management view
* *************************************** */
invCont.buildInvManagementView = async (req, res, next) =>{
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

//Process and Deliver add classification view
invCont.addClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Catch and process the add-classification data
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body; 
  const classificationResult = await invModel.addClassification(classification_name);
  
  if (classificationResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name} successfully`
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, failed to add classification.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  }
}

//Process and Deliver add Inventory view
invCont.addNewInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect: classificationSelect,
    errors: null
  })
}

/*** Catch, Process and Post the Add Inventory Data */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { 
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color} = req.body
  try {
    const invResult = await invModel.addNewInventory(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
      );
      if (invResult) {
        req.flash(
          "notice",
          "Congratulations, new inventory added successfully"
        );
        res.status(201).render("inventory/management", {
          title: "Inventory Management",
          nav,
        }
      );
    } else {
      req.flash("notice", "Failed to add inventory item.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory", 
        nav, 
        errors: null 
      });
    }
   
  }catch (error){
    req.flash("notice", "Sorry, failed to add inventory");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
      }
    );
  }
} 
module.exports = invCont