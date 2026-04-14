"use strict";

import express from "express";
import { create } from "express-handlebars";

import router from "./routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const handlebars = create({
  extname: ".hbs",
  helpers: {
    ifEquals(val1, val2, options) {
      return val1 == val2 ? options.fn(this) : options.inverse(this);
    },
    unlessEquals(val1, val2, options) {
      return val1 !== val2 ? options.fn(this) : options.inverse(this);
    },
    answerLetter(index) {
      const answers = "ABCD";
      return answers.charAt(index);
    },
    indexFromOne(index) {
      return index + 1;
    },
    ifIncludes(array, value, options) {
      if (!array || !Array.isArray(array)) {
        return options.inverse(this);
      }
      return array.includes(value) ? options.fn(this) : options.inverse(this);
    },
    concat(...params) {
      params.pop();
      return params.join("");
    },
    arrayFrom(...elements) {
      return elements.slice(0, -1);
    },
    serializeQuestions(questions) {
      return JSON.stringify(questions);
    }
  },
});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

app.use("/", router);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
