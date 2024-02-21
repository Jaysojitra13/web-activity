//ITE5315--Professor: Shahdad
const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const app = express();
const port = 3000;

// Set Templating Enginge
const handlebars = require("express-handlebars");
app.engine(
  "hbs",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      calculation: (num) => {
        return num + 10;
      },
      strong: (options) => {
        return `<strong> ${options.fn(this)} </strong>`;
      },
    },
  })
);
app.set("view engine", "hbs");

const urlencodedParser = bodyParser.urlencoded({ extended: true });

// Navigation
app.get("", (req, res) => {
  res.render("index", {
    layout: false, // do not use the default Layout (main.hbs)
  });
});

app.get("/demo", (req, res) => {
  res.render("demo", {
    layout: "main.hbs", // do not use the default Layout (main.hbs)
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    layout: false, // do not use the default Layout (main.hbs)
  });
});

app.post(
  "/register",
  urlencodedParser,
  [
    check("username", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())

      const alert = errors.array();
      res.render("register", {
        errs: alert,
        layout: false, // do not use the default Layout (main.hbs)
      });
    } else {
      res.render("output", {
        data: req.body,
        layout: "main.hbs",
      });
    }
  }
);

app.listen(port, () => console.info(`App listening on port: ${port}`));
