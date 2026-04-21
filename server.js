"use strict";

import express from "express";
import { create } from "express-handlebars";

import router from "./routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true, parseNested: true}));

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
    },
    formatNumber(value) {
      const num = parseInt(value);
      if (num < 1000) {
        return num.toString();
      }
      if (num < 10000) {
        return `${Math.floor(num / 100) * 100}+`;
      }
      if (num < 1000000) {
        return `${Math.floor(num / 1000)}K+`;
      }
      return `${Math.floor(num / 1000000)}M+`;
    },
    formatDate(value) {
      let date = new Date(value);
      let options = {
        year: "numeric",
        month: "long",
        day: "2-digit",
      };
      return `${date.toLocaleDateString("en-IE", options)}`;
    },
  },
});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

app.use("/", router);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
