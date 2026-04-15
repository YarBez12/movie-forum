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
  addUser(user) {
    this.store.addCollection(this.collection, user);
  },
    updateProfile(userId, newUsername, newEmail) {
    const user = this.getUserById(userId);
    if (user) {
      user.username = newUsername;
      user.email = newEmail;
      this.store.editCollection(this.collection, user.id, user);
    }
  },
  getUsersWithMostCompletedQuizzes(n=3) {
    const users = this.getAllUsers();
    const usersWithPlays = users.map((user) => {
      const quizIds = playsStore.getQuizzIdsForUser(user.id);
      return { ...user, completedQuizzes: quizIds.length };
    });
    const highestCompleted = Math.max(...usersWithPlays.map((user) => user.completedQuizzes));
    return {users: usersWithPlays.filter((user) => user.completedQuizzes === highestCompleted).map((user) => user.username).slice(0,n), quizCount: highestCompleted};
  },
  getNumberOfActiveUsers() {
    const users = this.getAllUsers();
    const activeUsers = users.filter((user) => {
      const quizIds = quizzesStore.getQuizzIdsForUser(user.id);
      return quizIds.length > 0;
    });
    return activeUsers.length;
  }
};

export default usersStore;
