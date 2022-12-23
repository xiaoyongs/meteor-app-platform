import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Accounts } from "meteor/accounts-base";
import { Roles } from "meteor/alanning:roles";
Meteor.methods({
  "users.create": function ({ username, role }) {
    check(username, String);
    check(role, String);
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }
    if (Accounts.findUserByUsername(username)) {
      throw new Meteor.Error("username already exists");
    }
    const newUserId = Accounts.createUser({
      username: username,
      password: "111111",
    });
    if (Meteor.roleAssignment.find({ "user._id": newUserId }).count() === 0) {
      Roles.addUsersToRoles(newUserId, role);
    }
  },
});
