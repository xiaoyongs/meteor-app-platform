const path = require("path");
const { spawn } = require("child_process");
import { readFileSync, writeFile } from "fs";
const fse = require("fs-extra");
import { rename } from "fs/promises";
import { TasksCollections } from "../collections/projects";
import { ErrorLogCollection } from "../collections/errorlog";
import { packageCollection } from "../collections/file";
import xml2js from "xml2js";
const builder_path = Meteor.settings.public.builder_path;
const storage_path = Meteor.settings.public.storage_path;
const buildFunction = (_id) => {
  const script_www = spawn("node", ["./scripts/www.js"], { cwd: builder_path });
  script_www.on(
    "close",
    Meteor.bindEnvironment((code) => {
      if (code) {
        console.log("script_www_err");
        ErrorLogCollection.insert({ taskId: _id, message: "script_www_err" });
        throw new Meteor.Error("script_www_err");
      }
      console.log("=================end www.js");
      const script_android = spawn("./scripts/android.sh", [], {
        cwd: builder_path,
      });

      script_android.stdout.on("data", (data) => {
        console.log(data.toString("ascii"));
      });
      script_android.stderr.on("data", (data) => {
        console.log(data.toString("ascii"));
      });

      script_android.on(
        "close",
        Meteor.bindEnvironment((code) => {
          if (code) {
            console.log("script_android_err");
            ErrorLogCollection.insert({
              taskId: _id,
              message: "script_android_err",
            });
            throw new Meteor.Error("script_android_err");
          }
          console.log("=================end android.sh");
          const script_android_package = spawn(
            "./scripts/android-package.sh",
            [],
            {
              cwd: builder_path,
            }
          );
          script_android_package.stdout.on("data", (data) => {
            console.log(data.toString("ascii"));
          });
          script_android_package.stderr.on("data", (data) => {
            console.log(data.toString("ascii"));
          });

          script_android_package.on(
            "close",
            Meteor.bindEnvironment((code) => {
              if (code) {
                console.log("script_android_package_err");
                ErrorLogCollection.insert({
                  taskId: _id,
                  message: "script_android_package_err",
                });
                TasksCollections.update(_id, {
                  $set: {
                    status: "failed",
                  },
                });
                throw new Meteor.Error("script_android_package_err");
              }
              try {
                fse.copySync(
                  path.join(builder_path, "archives", "Hiper Matic.apk"),
                  path.join(storage_path, "package", `${_id}.apk`)
                );
              } catch (err) {
                TasksCollections.update(_id, {
                  $set: {
                    status: "failed",
                  },
                });
                throw new Meteor.Error("remove apk error");
              }
              packageCollection.addFile(
                path.join(storage_path, "package", `${_id}.apk`),
                {},
                (err, fileRef) => {
                  if (err) {
                    TasksCollections.update(_id, {
                      $set: {
                        status: "failed",
                      },
                    });
                    throw new Meteor.Error("add package collection fail");
                  }
                  TasksCollections.update(_id, {
                    $set: {
                      status: "completed",
                      output: {
                        _id: fileRef._id,
                        path: fileRef.path,
                      },
                    },
                  });
                }
              );
            })
          );
        })
      );
    })
  );
};
const publish = async (_id, config) => {
  TasksCollections.update(_id, {
    $set: {
      status: "running",
    },
  });
  const copy_splash = new Promise((resolve, reject) => {
    const cp_process = spawn("cp", [
      config.splash.path,
      path.join(builder_path, "/resources/splash.png"),
    ]);
    cp_process.on("close", (code) => {
      if (code) {
        console.log("cp_splash_err");
        reject("cp_splash_err");
        return;
      }
      resolve();
    });
  });
  const copy_icon = new Promise((resolve, reject) => {
    const cp_process = spawn("cp", [
      config.icon.path,
      path.join(builder_path, "/resources/icon.png"),
    ]);
    cp_process.on("close", (code) => {
      if (code) {
        console.log("cp_icon_err");
        reject("cp_icon_err");
        return;
      }
      resolve();
    });
  });
  const copy_build_file = new Promise((resolve, reject) => {
    const cp_process = spawn("cp", [
      config.buildFile.path,
      path.join(builder_path, "/build.zip"),
    ]);
    cp_process.on("close", (code) => {
      if (code) {
        console.log("cp_build_file_err");
        reject("cp_build_file_err");
        return;
      }
      resolve();
    });
  });
  const remove_www = new Promise((resolve, reject) => {
    const rm_process = spawn("rm", ["-rf", path.join(builder_path, "/www")]);
    rm_process.on("close", (code) => {
      if (code) {
        console.log("rm_www_err");
        reject("rm_www_err");
        return;
      }
      resolve();
    });
  });
  const remove_platforms = new Promise((resolve, reject) => {
    const rm_process = spawn("rm", [
      "-rf",
      path.join(builder_path, "/platforms"),
    ]);
    rm_process.on("close", (code) => {
      if (code) {
        reject("rm_platforms_err");
        return;
      }
      resolve();
    });
  });

  const modify_xml = new Promise((resolve, reject) => {
    const xmlData = readFileSync(path.join(builder_path, "config.xml"), {
      encoding: "utf8",
    });
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        reject("parse_xml_fail");
        throw err;
      }
      const jsonData = result;
      jsonData["widget"]["$"]["version"] = config.version;
      jsonData["widget"]["$"]["id"] = config.boundleId;
      jsonData["widget"]["name"] = [config.app_name];
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(jsonData);
      writeFile(path.join(builder_path, "config.xml"), xml, (err) => {
        if (err) {
          reject("write_xml_fail");
          throw err;
        }
        resolve();
        console.log(`XML updated`);
      });
    });
  });

  const prepare_promise_list = [
    copy_splash,
    copy_icon,
    copy_build_file,
    remove_platforms,
    remove_www,
    modify_xml,
  ];
  await Promise.all(prepare_promise_list)
    .then((result) => {
      const unzip_process = spawn("tar", ["-xf", "build.zip"], {
        cwd: builder_path,
      });
      unzip_process.on(
        "close",
        Meteor.bindEnvironment((code) => {
          if (code) {
            ErrorLogCollection.insert({ taskId: _id, message: "unzip error" });
            throw new Meteor.Error("unzip error");
          }
          rename(
            path.join(builder_path, "build"),
            path.join(builder_path, "www")
          ).then(() => {
            const resource_process = spawn("ionic", ["cordova", "resources"], {
              cwd: builder_path,
            });
            resource_process.on(
              "close",
              Meteor.bindEnvironment((code) => {
                if (code) {
                  ErrorLogCollection.insert({
                    taskId: _id,
                    message: "generate resources fail",
                  });
                  throw new Meteor.Error("generate resources fail");
                }
                buildFunction(_id);
              })
            );
          });
        })
      );
    })
    .catch((err) => {
      console.log("something wrong");
      TasksCollections.update(_id, {
        $set: {
          status: "error",
        },
      });
      throw new Meteor.Error("something wrong");
    });
};

export default publish;
