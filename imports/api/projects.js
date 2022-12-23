import { Meteor } from "meteor/meteor";

import { Mongo } from "meteor/mongo";
import { ProjectsCollection } from "./collections/projects";
import { check } from "meteor/check";
import { Roles } from "meteor/alanning:roles";
import moment from "moment";

Meteor.methods({
  "projects.create": function ({ project_name, app_name }) {
    check(project_name, String);
    check(app_name, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }
    try {
      const managers = [];
      if (!Roles.userIsInRole(this.userId, "admin")) {
        const manager = Meteor.users.findOne({ _id: this.userId });
        managers.push(manager);
      }
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      ProjectsCollection.insert({
        project_name,
        app_name,
        managers,
        createdAt,
      });
    } catch (err) {
      throw new Meteor.Error(err.message);
    }
  },
});
