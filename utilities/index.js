const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' Vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id + '" title="View ' + vehicle.inv_make + 
        ''+ vehicle.inv_model + 'details"><img src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += ''
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Higher Order function Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next))
.catch(next);


/*******Building the vehicle details to be wrapped in HTML into the view ***** */
Util.buildVehicleDetailsGrid = function (vehicleInfo) {
  let vehicleHTML = '<div class="inv-display">';
    vehicleHTML += `
    <div id="detailHeader"> 
      <h2>
        ${vehicleInfo.inv_year} ${vehicleInfo.inv_make} ${vehicleInfo.inv_model}
      </h2>
    </div>

    <div id="detailsLeft">
      <img src="${vehicleInfo.inv_image}" alt="Image of ${vehicleInfo.inv_make} ${vehicleInfo.inv_model} on CSE Motors">
    </div>

    <div id="detailsRight">
      <h3> ${vehicleInfo.inv_make} ${vehicleInfo.inv_model} Details </h3>
      <ul><li><h4> Price: $${new Intl.NumberFormat("en-US").format(vehicleInfo.inv_price)}</h4></li></ul>
      <ul><li><h4 style="display: inline;">Description: </h4> ${vehicleInfo.inv_description}</li></ul>
      <ul><li><h4 style="display: inline;">Color: </h4> ${vehicleInfo.inv_color}</li></ul>
      <ul><li><h4 style="display: inline;">Miles: </h4> ${new Intl.NumberFormat("en-US").format(vehicleInfo.inv_miles)} </li></ul>
    </div>
  </div>`;
  return vehicleHTML;
};

/***Add Inventory Form Classification Selection List */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }


  /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
    jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware to check for account type
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  if (!res.locals.accountData) {
    req.flash("notice", "You are not logged in.");
    return res.redirect("/account/login");
  }
  if (res.locals.accountData.account_type == "Employee" ||
    res.locals.accountData.account_type == "Admin"
  ) {
    next();
  } else {
    req.flash("notice", "You are not authorized to view this page.");
    return res.redirect("/account/login");
  }
};
 
//Checking User sign Type
Util.checkAccountTypeIsAdmin = (req, res, next) => {
  if (!req || !res || !res.locals) {
    throw new Error("checkAccountType middleware called incorrectly.");
  }

  if (!res.locals.accountData) {
    req.flash("notice", "You are not logged in.");
    return res.redirect("/account/login");
  }

  if (res.locals.accountData.account_type === "Admin") {
    return next();
  } else {
    req.flash("notice", "You are not authorized to view this page.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountTypeIsEmployee = (req, res, next) => {
  if (!req || !res || !res.locals) {
    throw new Error("checkAccountType middleware called incorrectly.");
  }

  if (!res.locals.accountData) {
    req.flash("notice", "You are not logged in.");
    return res.redirect("/account/login");
  }

  if (res.locals.accountData.account_type === "Employee") {
    return next();
  } else {
    req.flash("notice", "You are not authorized to view this page.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountTypeIsUser = (req, res, next) => {
  if (!req || !res || !res.locals) {
    throw new Error("checkAccountType middleware called incorrectly.");
  }

  if (!res.locals.accountData) {
    req.flash("notice", "You are not logged in.");
    return res.redirect("/account/login");
  }

  next();
};
/*** Account_type Selection List */
Util.buildAccountTypeList = async function (account_type = null) {
  try {
    const data = await accountModel.getAccountsByType();
    let typeList = '<select name="type_id" id="typeList" required>';
    typeList += "<option value=''>Choose Account Type</option>";

    data.rows.forEach((row) => {
      let selected = account_type && row.account_type === account_type ? " selected" : "";
      typeList += `<option value="${row.account_type}"${selected}>${row.account_type}</option>`;
    });

    typeList += "</select>";
    return typeList;
  } catch (error) {
    console.error("Error fetching account types:", error);
    return "<p>Unable to load account types.</p>";
  }
};

module.exports = Util