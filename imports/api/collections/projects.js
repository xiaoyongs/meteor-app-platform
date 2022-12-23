import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const ProjectVersionSchema = new SimpleSchema({
  version: String,
  platform: Array,
  platform: { type: Array },
  "platform.$": { type: String },
  project_name: String,
  splash: Object,
  logo: Object,
  app_name: String,
  signature: Object,
  license: Object,
});

export const VersionsCollection = new Mongo.Collection("versions");
VersionsCollection.attachSchema(ProjectVersionSchema);

const ProjectsSchema = new SimpleSchema({
  project_name: { type: String, index: true, unique: true },
  app_name: String,
  managers: { type: Array },
  "managers.$": { type: Object },
  "managers.$._id": { type: String },
  "managers.$.username": { type: String },
  createdAt: String,
});

export const ProjectsCollection = new Mongo.Collection("projects");
ProjectsCollection.attachSchema(ProjectsSchema);
