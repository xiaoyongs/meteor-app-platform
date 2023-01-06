import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const fileSchema = new SimpleSchema(
  {
    _id: String,
    path: String,
  },
  { requiredByDefault: false }
);

const ProjectsSchema = new SimpleSchema(
  {
    project_name: { type: String, index: true, unique: true, required: true },
    app_name: String,
    managers: { type: Array },
    "managers.$": { type: Object },
    "managers.$._id": { type: String },
    "managers.$.username": { type: String },
    members: { type: Array },
    "members.$": { type: Object },
    "members.$._id": { type: String },
    "members.$.username": { type: String },
    splash: { type: fileSchema },
    icon: { type: fileSchema },
    boundleId: String,
    createdAt: String,
  },
  { requiredByDefault: false }
);

export const ProjectsCollection = new Mongo.Collection("projects");
ProjectsCollection.attachSchema(ProjectsSchema);

const TasksSchema = new SimpleSchema(
  {
    platform: String,
    project_id: String,
    project_name: String,
    createdAt: String,
    config: SimpleSchema.Any,
    status: String,
    output: fileSchema,
  },
  { requiredByDefault: false }
);
export const TasksCollections = new Mongo.Collection("tasks");
TasksCollections.attachSchema(TasksSchema);
