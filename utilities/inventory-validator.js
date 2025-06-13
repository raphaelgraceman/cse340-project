const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");




//Validation logics for inventory item
function validateInventory(req, res, next) {
    const { 
        inv_make, 
        inv_model, 
        classification_id 
    } = req.body;

    // Validation checks
    if (!inv_make || !inv_model || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/inv/add-inventory');
    }
    next();
}


//Validation checks to direct errors to the edit view
function checkUpdateData(req, res, next) {
    const { 
        inv_id, 
        inv_make, 
        inv_model, 
        classification_id 
    } = req.body;

    // Validation checks
    if (!inv_id || !inv_make || !inv_model || !classification_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/inv/edit-inventory'); 
    }

    next(); 
}



module.exports = { validateInventory, checkUpdateData };