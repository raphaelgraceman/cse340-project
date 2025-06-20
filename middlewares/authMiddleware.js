const authenticated = {}
authenticated.checkLoginRole = async(allowedUsers = []) =>{
  return function (req, res, next) {
    const user = req.session.accountData;
    if (!user || !allowedUsers.includes(user.account_type)) {
      return res.status(403).send("Access denied.");
    }
    next();
  };
}

module.exports = authenticated

