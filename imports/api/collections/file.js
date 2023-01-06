import { FilesCollection } from "meteor/ostrio:files";
import { storage_path } from "/imports/paths.js";
import path from "path";
export const splashCollection = new FilesCollection({
  collectionName: "splash",
  storagePath: path.join(storage_path, "splash"),
});
export const iconCollection = new FilesCollection({
  collectionName: "icon",
  storagePath: path.join(storage_path, "icon"),
});
export const buildCollection = new FilesCollection({
  collectionName: "build",
  storagePath: path.join(storage_path, "build"),
});
export const packageCollection = new FilesCollection({
  collectionName: "package",
  storagePath: path.join(storage_path, "package"),
});
