"use strict";

import usersStore from "../models/users-store.js";
import { v4 as uuidv4 } from "uuid";

const accounts = {
  login(request, response) {
    const viewData = {
      title: "Login",
    };
    response.render("login", viewData);
  },
  logout(request, response) {
    response.cookie("user", "");
    response.redirect("/");
  },
  signup(request, response) {
    const viewData = {
      title: "Create Account",
    };
    response.render("register", viewData);
  },
  register(request, response) {
    const user = {
      id: uuidv4(),
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
    };
    usersStore.addUser(user);
    response.cookie("user", user.id);
    console.log("Registered new user:", user);
    response.redirect("/start");
  },
  authenticate(request, response) {
    let user = usersStore.getUserByNickname(request.body.username);
    if (!user) {
      user = usersStore.getUserByEmail(request.body.username);
    }
    if (user && user.password === request.body.password) {
      response.cookie("user", user.id);
      response.redirect("/start");
    } else {
      response.redirect("/");
    }
  },
  getCurrentUser(request) {
    const userId = request.cookies.user;
    console.log("Current user ID from cookie:", userId);
    return usersStore.getUserById(userId);
  },
};

export default accounts;
