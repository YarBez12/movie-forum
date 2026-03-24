/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.hbs", "./public/**/*.js"],
  theme: {
    extend: {
      screens: {
        mini: "350px",
        "xs-phone": "420px",
        phone: "500px",
        xs: "600px",
      },
    },
  },
  plugins: [],
};
