import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from "meteor/alanning:roles";
import "/imports/api/users.js";
import "/imports/api/projects.js";

const SEED_USERNAME = "admin";
const SEED_PASSWORD = "admin123123";

Meteor.startup(() => {
  Roles.createRole("admin", { unlessExists: true });
  Roles.createRole("manager", { unlessExists: true });
  Roles.createRole("developer", { unlessExists: true });
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    const adminId = Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    if (Meteor.roleAssignment.find({ "user._id": adminId }).count() === 0) {
      Roles.addUsersToRoles(adminId, "admin");
    }
  }
});
