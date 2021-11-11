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

const generateRandomString = () => {
  let strRandom = "";
  let alph = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  for (let i = 0; i < 7; i++) {
    strRandom += alph.join("").charAt(Math.floor(Math.random() * alph.length));
  }
  return strRandom;
};

module.exports = { emailLookup, passwordLookup, generateRandomString };
