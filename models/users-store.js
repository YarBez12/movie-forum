import JsonStore from "./json-store.js";
import playsStore from "./plays-store.js";
import quizzesStore from "./quizes-store.js";
import utils from "../utils/models/utils.js";

const usersStore = {
  // Storage of all users
  store: new JsonStore("./models/users-store.json", { users: [] }),
  collection: "users",
  // Get all users from the store
  getAllUsers() {
    return this.store.findAll(this.collection);
  },
  // Find user by unique nickname
  getUserByNickname(nickname) {
    return this.store.findOneBy(
      this.collection,
      (user) => user.username === nickname,
    );
  },
  // Find user by id
  getUserById(id) {
    return this.store.findOneBy(this.collection, (user) => user.id === id);
  },

  // Find user by unique email
  getUserByEmail(email) {
    return this.store.findOneBy(
      this.collection,
      (user) => user.email === email,
    );
  },

  // Add new user with avatar
  async addUser(user, avatar) {
    try {
      // Add avatar to cloudinary or set default
      user.avatar = await utils.addImageToCloudinary(avatar, this.store, {
        url: "/img/default-avatar.jpg",
      });
      this.store.addCollection(this.collection, user);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  },
  // Update existing user profile
  async updateProfile(userId, newUsername, newEmail, newAvatar) {
    // Get current user
    const user = this.getUserById(userId);
    if (user) {
      try {
        user.username = newUsername;
        user.email = newEmail;
        const oldAvatar = user.avatar;
        // Add new avatar to cloudinary if it is given
        user.avatar = await utils.addImageToCloudinary(
          newAvatar,
          this.store,
          user.avatar,
        );
        // If new avatar is given, delete old avatar
        if (newAvatar) {
          await utils.deleteImageFromCloudinary(oldAvatar, this.store);
        }
        this.store.editCollection(this.collection, user.id, user);
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  },

  // Get users who completed the most quizzes
  getUsersWithMostCompletedQuizzes(n = 3) {
    const users = this.getAllUsers();
    // Add number of completed quizzes to each user
    const usersWithPlays = users.map((user) => {
      // Get quizzes completed by user
      const quizIds = playsStore.getQuizzIdsForUser(user.id);
      return { ...user, completedQuizzes: quizIds.length };
    });
    console.log(usersWithPlays);

    // Get highest number of completed quizzes
    const highestCompleted = Math.max(
      ...usersWithPlays.map((user) => user.completedQuizzes),
    );
    return {
      users: usersWithPlays
        // Filter users with highest number of completed quizzes
        .filter((user) => user.completedQuizzes === highestCompleted)
        .map((user) => user.username)
        // Return only n users
        .slice(0, n),
      quizCount: highestCompleted,
    };
  },

  // Get number of users who created at least one quiz
  getNumberOfActiveUsers() {
    const users = this.getAllUsers();
    const activeUsers = users.filter((user) => {
      // Get quizzes created by user
      const quizIds = quizzesStore.getQuizIdsForUser(user.id);
      return quizIds.length > 0;
    });
    return activeUsers.length;
  },
};

export default usersStore;
