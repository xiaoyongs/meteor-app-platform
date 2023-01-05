import { FilesCollection } from "meteor/ostrio:files";
export const splashCollection = new FilesCollection({
  collectionName: "splash",
  storagePath: "/Users/xiaoyongsufl/Desktop/storage/splash",
});
export const iconCollection = new FilesCollection({
  collectionName: "icon",
  storagePath: "/Users/xiaoyongsufl/Desktop/storage/icon",
});
export const buildCollection = new FilesCollection({
  collectionName: "build",
  storagePath: "/Users/xiaoyongsufl/Desktop/storage/build",
});
