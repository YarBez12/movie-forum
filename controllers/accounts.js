"use strict";

import usersStore from "../models/users-store.js";
import { v4 as uuidv4 } from "uuid";

// Controller for accounts management (login, logout, registration)
const accounts = {
  // Render login page
  login(request, response) {
    const viewData = {
      title: "Login",
    };
    response.render("login", viewData);
  },
  // Logout user by clearing cookie and redirecting to home login page
  logout(request, response) {
    response.cookie("user", "");
    response.redirect("/");
  },
  // Render registration page
  signup(request, response) {
    const viewData = {
      title: "Create Account",
    };
    response.render("register", viewData);
  },
  // Handle user registration with validation and avatar upload
  async register(request, response) {
    // Extract registration data from request body
    const { username, email, password, confirmPassword } = request.body;
    let error = "";
    // Validate password strength, confirmation, and uniqueness of username/email
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
    // If there are validation errors, re-render registration page with error message and previous input
    if (error) {
        const viewData = {
            title: "Create Account",
            error: error,
            previous: { username, email },
        };
        response.render("/register", viewData);
        return;
    }

    // Create new user object and handle avatar upload
    const user = {
      id: uuidv4(),
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
    };
    const avatar = request.files ? request.files.image : null;
    await usersStore.addUser(user, avatar);
    // Set cookie with user ID and redirect to start page
    response.cookie("user", user.id);
    response.redirect("/start");
  },
  // Handle user authentication during login
  authenticate(request, response) {
    // Extract login credentials from request body
    const { username, password } = request.body;
    // Attempt to find user by username or email
    let user = usersStore.getUserByNickname(username);
    if (!user) {
      user = usersStore.getUserByEmail(username);
    }
    // If user is found and password matches, set cookie and redirect to start page
    if (user && user.password === password) {
      response.cookie("user", user.id);
      response.redirect("/start");
    } else {
      // If authentication fails, re-render login page with error message and previous input
        const viewData = {
            title: "Login",
            error: "Invalid username/email or password.",
            previous: { username, password },
        };
        response.render("login", viewData);
    }
  },
};

export default accounts;
