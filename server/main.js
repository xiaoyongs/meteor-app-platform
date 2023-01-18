import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from "meteor/alanning:roles";
import "/imports/api/users.js";
import "/imports/api/projects.js";
import "/imports/api/file.js";

const SEED_USERNAME = "admin";
const SEED_PASSWORD = "admin123123";
import { isEmpty } from "lodash";
import { TasksCollections } from "/imports/api/collections/projects";
import androidPublish from "/imports/api/scripts/android";

const buildTasks = () => {
  const runningTask = TasksCollections.findOne({ status: "running" });
  if (isEmpty(runningTask)) {
    const nextTask = TasksCollections.findOne(
      { status: "pending" },
      {
        sort: {
          createdAt: 1,
        },
      }
    );
    if (isEmpty(nextTask)) {
      return;
    } else {
      androidPublish(nextTask._id, nextTask.config);
    }
  } else {
    return;
  }
};
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

  Meteor.setInterval(buildTasks, 5000);
});
