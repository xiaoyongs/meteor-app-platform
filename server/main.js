import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

const SEED_USERNAME = "admin";
const SEED_PASSWORD = "admin123123";

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
      profile: { role: "admin" },
    });
  }
});
