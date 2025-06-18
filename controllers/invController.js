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
  const vehicleInfo = await invModel.getVehicleById(vehicle_id);
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
  const messages = req.flash("notice");
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect: classificationSelect,
    messages,
    errors: null
  })
}

//Process and Deliver add classification view
invCont.addClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const messages = req.flash("notice");
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    classificationSelect: classificationSelect,
    messages,
    errors: null
  })
}

/* ****************************************
*  Catch and process the add-classification data
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const messages = req.flash("notice");
  const { classification_name } = req.body; 
  const classificationResult = await invModel.addClassification(classification_name);
 if (classificationResult) {
    res.status(
      "notice",
      `Congratulations, you added ${classification_name} successfully`
    );
    
    return res.redirect('/inv' ); 
  } else {
    req.flash("notice", "Sorry, failed to add classification.");
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages
    });
  }
}

//Process and Deliver add Inventory view
invCont.addNewInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const messages = req.flash ? req.flash("notice") : [];
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect: classificationSelect,
    messages,
    errors: null
  })
}


//Process the add inventory
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
    inv_color,
    classification_id
  } = req.body;
  const invResult = await invModel.addNewInventory(
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
  );
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${inv_make} successfully`
    );

    return res.redirect("/inv");

  } else {
    req.flash("notice", "Sorry, failed to add inventory.");
    return res.status(201).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
    });
  }
};

/* ***************************
 *  Build inventory update view
 * ************************** */
invCont.updateInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  let nav = await utilities.getNav()
  res.render("./inventory/update", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image.image_url,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    errors: null
  })
}


/* *************************** To display inventory items when a classification is selected 
 *  Return Inventory by Classification As JSON (Before Edit or Delete)
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Process Update Inventory Data
 * ************************** */
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
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/update", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
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
    classification_id
    })
  }
}

/* ***************************
 * Delete Inventory view * ***********            *************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })
}


//Process Delete inventory Data ************* */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id, inv_make, inv_model,
    inv_price, inv_year,  classification_id,
  } = req.body
  const deleteResult = await invModel.updateInventory(
    inv_id,  inv_make, inv_model, inv_price, inv_year, classification_id
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
    })
  }
}
 
module.exports = invCont











