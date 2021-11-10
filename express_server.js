const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");

//////URL DATABASE//////////////////
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
////////////////////////////////////

/////////USERS DATABASE////////////
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
////////////////////////////////////

const bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(302, longURL);
});

app.get("/register", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[user] };
  res.render("urls_register", templateVars);
});

app.post("/logout", (req, res) => {
  let user = req.cookies["user_id"];
  res.clearCookie("user_id", user);
  res.redirect(302, `/urls`);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(302, `/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(302, `/urls`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(302, `/urls`);
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect(302, "/urls");
});

app.post("/register", (req, res) => {
  let userid = generateRandomString();
  if (!emailLookup(req.body.email)) {
    res.status(400);
    res.send("Email is taken, please go back and try again.");
  } else if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send(
      "email or password cannot be blank, please go back and try again."
    );
  } else {
    users[userid] = {
      id: userid,
      email: req.body.email,
      password: req.body.password,
    };
  }
  res.cookie("user_id", userid);
  res.redirect(302, "/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const emailLookup = (email) => {
  for (user in users) {
    if (users[user].email === email) {
      return false;
    }
  }
  return true;
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
