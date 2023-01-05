import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const ErrorLogSchema = new SimpleSchema({
  taskId: String,
  message: String,
});

export const ErrorLogCollection = new Mongo.Collection("errorlogs");
ErrorLogCollection.attachSchema(ErrorLogSchema);
