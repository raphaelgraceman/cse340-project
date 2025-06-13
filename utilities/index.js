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
      ' vehicles">' +
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
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
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
          <a href="../../inv/detail/${vehicleInfo.inv_id}" title="View ${vehicleInfo.inv_make} ${vehicleInfo.inv_model} details">
              ${vehicleInfo.inv_make} ${vehicleInfo.inv_model}
          </a>
      </h2>
      <span>$${new Intl.NumberFormat('en-US').format(vehicleInfo.inv_price)}</span>
  </div>

  <div id="detailsLeft">
      <a href="../../inv/detail/${vehicleInfo.inv_id}" title="View ${vehicleInfo.inv_make} ${vehicleInfo.inv_model} details">
          <img src="${vehicleInfo.inv_image}" alt="Image of ${vehicleInfo.inv_make} ${vehicleInfo.inv_model} on CSE Motors">
      </a>
  </div>

  <div id="detailsRight">
      <ul id="detailsList">
          <li><span> Price: $${new Intl.NumberFormat("en-US").format(vehicleInfo.inv_price)}</span></li>
          <li><span> Description: ${vehicleInfo.inv_description} </span></li>
          <li><span> Color: ${vehicleInfo.inv_color} </span></li>
          <li><span> Miles: ${vehicleInfo.inv_miles} </span></li>
      </ul>
      
      <!-- Add to Cart Form -->
      <form action="/cart/cart-view" method="POST" style="margin-top: 20px;">
          <input type="hidden" name="inv_id" value="${vehicleInfo.inv_id}">
          <label for="quantity">Quantity:</label>
          <input type="number" name="quantity" id="quantity" value="1" min="1" required>
          <button type="submit">Add to Cart</button>
      </form>
  </div>
  </div>`;
  return vehicleHTML;
};
module.exports = Util