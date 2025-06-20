const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Get all account type data
 * ************************** */
async function getAllAccounts() {
  const result = await pool.query(
    'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account ORDER BY account_type, account_lastname'
  );
  return result.rows;
}

async function getAccountsByType(account_type) {
  try {
    const result = await pool.query(
    'SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_type = $1 ORDER BY account_lastname',
    [account_type]
  );
  return result.rows;

  } catch (error) {
    return new Error("No matching email found")
  }
}
async function getAccountById(account_id) {
  try {
      const result = await pool.query(
    'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
    [account_id]
  );
  return result.rows[0];

  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountsByName(account_firstname, account_lastname) {
  try {
    const result = await pool.query(
    'SELECT account_id, account_firstname, account_lastname, account_email FROM account WHERE account_type = $1 ORDER BY account_lastname',
    [account_firstname, account_lastname]
  );
  return result.rows[0];

  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Delete User Account
 * ************************** */
 async function deleteUserAccount(account_id) {
  try {
    const sql = 'DELETE FROM account WHERE account_id = $1'
    const data = await pool.query(sql, [account_id])
  return data
  } catch (error) {
    new Error("Delete User Account Error")
  }
}



/* ***************************
 *  Update Account
 * ************************** */
async function updateAccount(
  account_id, account_firstname, account_lastname, account_email, account_type, account_password) {
  try {
    const sql =
      "UPDATE public.account SET account_id = $1, account_firstname = $2, account_lastname = $3, account_email = $4, account_type = $5, account_password = $6 RETURNING *"
    const data = await pool.query(sql, [
      account_id, account_firstname, account_lastname, account_email, account_type, account_password])
    return data.rows[0]

  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail,
  getAllAccounts, getAccountsByType, getAccountById, getAccountsByName, deleteUserAccount, updateAccount
} //updateAccount, deleteUserAccount}