import { Meteor } from "meteor/meteor";

import { Mongo } from "meteor/mongo";
import { ProjectsCollection, TasksCollections } from "./collections/projects";
import { check } from "meteor/check";
import { Roles } from "meteor/alanning:roles";
import moment from "moment";
import androidPublish from "./scripts/android";
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
        members: [],
        createdAt,
      });
    } catch (err) {
      throw new Meteor.Error(err.message);
    }
  },
  "projects.update": function ({ projectId, params }) {
    check(projectId, String);
    check(params, Object);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }
    try {
      ProjectsCollection.update(projectId, {
        $set: params,
      });
    } catch (err) {
      throw new Meteor.Error(err.message);
    }
  },
  "projects.publishAndroid": function ({ config }) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }
    try {
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      TasksCollections.insert({
        platform: "android",
        project_id: config._id,
        project_name: config.project_name,
        config,
        createdAt,
        status: "pending",
      });
    } catch (err) {
      throw new Meteor.Error(err.message);
    }
  },
});
