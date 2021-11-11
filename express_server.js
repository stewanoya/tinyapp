const express = require("express");
const app = express();
const PORT = 8080;
var cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
const { emailLookup, passwordLookup } = require("./helpers/userHelpers");

//////URL DATABASE//////////////////
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
////////////////////////////////////

////////-USERS DATABASE///////////
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    // shoutout to anyone that gets the reference
    keys: ["The Temp at Night."],
  })
);

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  const user = req.session["user_id"];
  if (!user) {
    res.redirect(302, "/login");
  }
  res.redirect(302, "/urls");
});

app.get("/urls", (req, res) => {
  const user = req.session["user_id"];
  if (!user) {
    res.redirect("/");
  }
  const templateVars = { urls: urlDatabase, user: users[user] };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  const user = req.session["user_id"];
  const templateVars = { user };
  if (!templateVars[user]) {
    templateVars[user] = null;
  }
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session["user_id"]) {
    res.status(403).redirect("/register");
  }
  const user = req.session["user_id"];
  const templateVars = { user: users[user] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = req.session["user_id"];
  if (!user) {
    res.redirect("/login");
  } else if (urlDatabase[req.params.shortURL]["userID"] !== user) {
    res.redirect("/login");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]["longURL"],
      user: users[user],
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const user = req.session["user_id"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[user],
  };
  res.redirect(302, templateVars["longURL"]);
});

app.get("/register", (req, res) => {
  const user = req.session["user_id"];
  const templateVars = { urls: urlDatabase, user: users[user] };
  res.render("urls_register", templateVars);
});

app.post("/logout", (req, res) => {
  let user = req.session["user_id"];
  //deletes cookie after signing out
  req.session = null;
  res.redirect(302, `/login`);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session["user_id"],
  };
  res.redirect(302, `/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let user = req.session["user_id"];
  console.log("Here is my user", user);
  console.log(
    "here is what I want to compare it to",
    urlDatabase[req.params.shortURL]["userID"]
  );
  //conditional check to see if person is signed in and to make sure id of url
  //match id of user before deleting
  if (!user) {
    res.status(403);
    res.redirect("/login");
  } else if (urlDatabase[req.params.shortURL]["userID"] !== user) {
    res.status(403);
    res.redirect("/login");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect(302, `/urls`);
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  // editing the longurl to whatever is put into form
  urlDatabase[req.params.shortURL]["longURL"] = req.body["longURL"];

  res.redirect(302, `/urls/${req.params.shortURL}`);
});

app.post("/login", (req, res) => {
  const emailCheck = emailLookup(req.body.email, users);
  const passCheck = passwordLookup(req.body.password, users);
  // checks 'database' to see if emailcheck and passcheck are true
  if (emailCheck && passCheck) {
    // if they are it stores the cookie with the userID
    req.session.user_id = emailCheck["id"];
    res.redirect(302, "/urls");
  } else {
    // it will throw an error and message otherwise
    res.status(403);
    res.send(
      "Your email or password was incorrect, please go back and try again."
    );
  }
  console.log("check to see if password is hashed", users);
});

app.post("/register", (req, res) => {
  let userid = generateRandomString();

  // check to see if email is taken and throws error
  if (emailLookup(req.body.email, users)) {
    res.status(400);
    res.send("Email is taken, please go back and try again.");
    // check to see if email or password are empty fields and throws error
  } else if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send(
      "email or password cannot be blank, please go back and try again."
    );
  } else {
    req.session.user_id = userid;

    users[userid] = {
      id: userid,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };
  }
  res.redirect(302, "/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

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
