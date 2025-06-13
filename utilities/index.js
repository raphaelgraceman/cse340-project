const invModel = require("../models/inventory-model")
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
      <ul><li><h4 style="display: inline;">Miles: </h4>  ${vehicleInfo.inv_miles}</li></ul>

    

    
    </div>
  </div>`;
  return vehicleHTML;
};
module.exports = Util