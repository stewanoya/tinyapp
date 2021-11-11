const bcrypt = require("bcryptjs");

const emailLookup = (email, db) => {
  for (user in db) {
    if (db[user].email === email) {
      return db[user];
    }
  }

  return false;
};

const passwordLookup = (password, db) => {
  for (user in db) {
    if (bcrypt.compareSync(password, db[user].password)) {
      return db[user];
    }
  }
  return false;
};
module.exports = { emailLookup, passwordLookup };
