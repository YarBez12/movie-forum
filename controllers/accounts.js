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
  async register(request, response) {
    const { username, email, password, confirmPassword } = request.body;
    let error = "";
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      error = "Password must be at least 8 characters long and contain both letters and numbers.";
    } else if (password !== confirmPassword) {
      error = "Passwords do not match.";
    } else if (usersStore.getUserByNickname(username)) {
      error = "Username is already taken.";
    } else if (usersStore.getUserByEmail(email)) {
      error = "Email is already registered.";
    }
    
    if (error) {
        const viewData = {
            title: "Create Account",
            error: error,
            previous: { username, email },
        };
        response.render("/register", viewData);
        return;
    }

    const user = {
      id: uuidv4(),
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
    };
    const avatar = request.files ? request.files.image : null;
    await usersStore.addUser(user, avatar);
    response.cookie("user", user.id);
    console.log("Registered new user:", user);
    response.redirect("/start");
  },
  authenticate(request, response) {
    const { username, password } = request.body;
    let user = usersStore.getUserByNickname(username);
    if (!user) {
      user = usersStore.getUserByEmail(username);
    }
    if (user && user.password === password) {
      response.cookie("user", user.id);
      response.redirect("/start");
    } else {
        const viewData = {
            title: "Login",
            error: "Invalid username/email or password.",
            previous: { username, password },
        };
        response.render("login", viewData);
    }
  },
  getCurrentUser(request) {
    const userId = request.cookies.user;
    console.log("Current user ID from cookie:", userId);
    return usersStore.getUserById(userId);
  },
};

export default accounts;
