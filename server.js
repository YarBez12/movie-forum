'use strict'

import express from 'express';
import { create } from 'express-handlebars';

import router from './routes.js';

const app = express()
const port = 3000;

app.use(express.static("public"));

const handlebars = create({
    extname: '.hbs',
    helpers: {
        ifEquals(val1, val2, options) {
            return (val1 == val2) ? options.fn(this) : options.inverse(this);
        },
        answerLetter(index) {
            const answers = "ABCD";
            return answers.charAt(index);
        },
        indexFromOne(index) {
            return index + 1;
        }
     }
});
app.engine('.hbs', handlebars.engine);
app.set("view engine", ".hbs");

app.use("/", router);

app.listen(port, () => console.log(`Express app running on port ${port}!`));