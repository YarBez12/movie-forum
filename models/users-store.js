import JsonStore from "./json-store.js";

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
};

export default usersStore;
