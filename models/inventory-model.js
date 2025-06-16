const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("get classifications by id error " + error)
  }
}

/* Vehicle details by ID */
async function getByVehicleId(inv_id)  {  
  try {
    const vehicleInfo = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [inv_id]
    )
    return vehicleInfo.rows[0]
  } catch (error) {
    console.error(error)
  } 
}; 


/* *****************************
*   INSERTING / Add classification data
* *************************** */
async function addClassification(classification_name) {
  try {
      const sql = "INSERT INTO classification(classification_name) VALUES ($1) RETURNING *";
      const result = await pool.query(sql, [classification_name]);
      return result.rows[0].classification_name; // return only the classification_name string
  } catch (error) {
      console.error("Error inserting classification:", error); // Log the error for debugging
      return error.message; // return the error message as a string
  }
}

/* *****************************
*   Adding New Inventory data
* *************************** */
async function addNewInventory(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id ) {
  try {
      const sql = "INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return  await pool.query(sql, [inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id]);
     
  } catch (error) {
      console.error("Error inserting inventory:", error);
      return error.message; 
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getByVehicleId, addClassification, addNewInventory}