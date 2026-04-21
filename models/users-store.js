import JsonStore from "./json-store.js";
import playsStore from "./plays-store.js";
import quizzesStore from "./quizes-store.js";

const usersStore = {
  store: new JsonStore("./models/users-store.json", { users: [] }),
  collection: "users",
  getAllUsers() {
    return this.store.findAll(this.collection);
  },
  getUserByNickname(nickname) {
    return this.store.findOneBy(
      this.collection,
      (user) => user.username === nickname,
    );
  },
  getUserById(id) {
    return this.store.findOneBy(this.collection, (user) => user.id === id);
  },
  getUserByEmail(email) {
    return this.store.findOneBy(
      this.collection,
      (user) => user.email === email,
    );
  },
  async addUser(user, avatar) {
    try {
      if (avatar) {
        user.avatar = await this.store.addToCloudinary(avatar);
      }
      this.store.addCollection(this.collection, user);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  },
  async updateProfile(userId, newUsername, newEmail, newAvatar) {
    const user = this.getUserById(userId);
    if (user) {
      try {
        user.username = newUsername;
        user.email = newEmail;
        const oldAvatar = user.avatar && user.avatar.public_id ? user.avatar.public_id : null;
        user.avatar = newAvatar
          ? await this.store.addToCloudinary(newAvatar)
          : user.avatar;
        console.log("Updated user profile:", user);
        if (newAvatar && oldAvatar) {
          try {
            await this.store.deleteFromCloudinary(oldAvatar);
          } catch (err) {
            console.error("Error deleting old avatar from Cloudinary:", err);
          }
        }
        this.store.editCollection(this.collection, user.id, user);
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  },
  getUsersWithMostCompletedQuizzes(n = 3) {
    const users = this.getAllUsers();
    const usersWithPlays = users.map((user) => {
      const quizIds = playsStore.getQuizzIdsForUser(user.id);
      return { ...user, completedQuizzes: quizIds.length };
    });
    const highestCompleted = Math.max(
      ...usersWithPlays.map((user) => user.completedQuizzes),
    );
    return {
      users: usersWithPlays
        .filter((user) => user.completedQuizzes === highestCompleted)
        .map((user) => user.username)
        .slice(0, n),
      quizCount: highestCompleted,
    };
  },
  getNumberOfActiveUsers() {
    const users = this.getAllUsers();
    const activeUsers = users.filter((user) => {
      const quizIds = quizzesStore.getQuizzIdsForUser(user.id);
      return quizIds.length > 0;
    });
    return activeUsers.length;
  },
};

export default usersStore;
