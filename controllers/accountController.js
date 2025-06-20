const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistrationView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations! You're registered ${account_firstname.toLowerCase()}, please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()

  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  } try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
      const cookieType = {httpOnly: true, maxAge: 3600 * 1000, secure: process.env.NODE_ENV !== 'development',}
      res.cookie("jwt", accessToken, cookieType)
      switch (accountData.account_type) {
        case 'Admin':
          return res.redirect("/account/adminDashboard")
        case 'Employee':
          return res.redirect("/account/employeeDashboard")
        default:
          return res.redirect("/account/userDashboard")
      }
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(403).send("Access Forbidden")
  }
}


/* ****************************************
*  The Account Management view
* *************************************** */
async function accountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accManagement", {
    title: "Account Management",
    nav,
    error: null,
  });
  req.session.error = null;
}

//Admin dashboard
async function getAdminDashboard(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountData = req.session.accountData;
    const allUsers = await accountModel.getAllAccounts(); 

    res.render("account/adminDashboard", {
      title: "Admin Dashboard",
      nav,
      accountData,
      users: allUsers,
    });
  } catch (error) {
    next(error); 
  }
}

//Employee view
async function getEmployeeDashboard(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountData = req.session.accountData;
    const clients = await accountModel.getAccountsByType("Client");

    res.render("account/employeeDashboard", {
      title: "Employee Dashboard",
      nav,
      accountData,
      users: clients,
    });
  } catch (error) {
    next(error);
  }
}

//AllUsers view
async function getUserDashboard(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountData = req.session.accountData;
    const { account_firstname, account_lastname, account_email, createdAt } = req.session

    res.render("account/userDashboard", {
      title: "User Dashboard",
      nav,
      accountData,
      user: accountData,
      account_firstname,
      account_lastname, 
      account_email,
    });
  } catch (error) {
    next(error);
  }
}


// Logout view 
async function getLogOutView(req, res, next) {
  try {
    const nav = await utilities.getNav();

    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return next(err);
      }

     res.clearCookie("connect.sid");  
      req.flash("notice", "You have been successfully logged out.");  
      res.render("/", {
        title,
        nav,
        redirectDelay: 2000, 
      });
      
    });
  } catch (error) {
    next(error);
  }
}


//Account delete view
async function deleteAccountView (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.deleteUserAccount(account_id)
  res.render("account/delete", {
    title: "Delete User Account?",
    nav,
    errors: null,
    accountData,
  })
}


//Account Update View
async function updateAccountView (req, res, next) {
  const account_email = parseInt(req.params.account_email)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountByEmail(account_email )
  const itemName = `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("account/update", {
    title: "Update" + itemName,
    nav,
    errors: null, 
    accountData, 
    account_email: accountData.account_email,  
  })
}

module.exports = { buildLogin, getLogOutView, buildRegistrationView, registerAccount, accountLogin, accountManagementView, getAdminDashboard, getEmployeeDashboard, getUserDashboard, deleteAccountView, updateAccountView}