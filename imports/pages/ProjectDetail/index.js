import React, { useRef, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import {
  ProjectsCollection,
  TasksCollections,
} from "/imports/api/collections/projects";
import { useTracker } from "meteor/react-meteor-data";
import ApplicationTable from "./ApplicationTable";
import {
  splashCollection,
  iconCollection,
} from "/imports/api/collections/file";
import PublishModal from "./PublishModal";
import { isEmpty } from "lodash";
const index = ({ props }) => {
  const modalInputRef = useRef();
  const [modifyingBundle, setModifyingBundle] = useState(false);
  let { projectId } = useParams();
  const handleSubmitSplash = (e) => {
    const upload = splashCollection.insert(
      {
        file: e.target.files[0],
        chunkSize: "dynamic",
      },
      false
    );
    upload.on("start", function () {
      console.log("--start");
    });
    upload.on("end", function (error, fileObj) {
      if (error) {
        console.log(`Error during upload: ${error}`);
      } else {
        const updateData = {
          projectId,
          params: {
            splash: { _id: fileObj._id, path: fileObj.path },
          },
        };
        Meteor.call("projects.update", updateData, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log("project updated");
          }
        });
      }
    });

    upload.start();
  };
  const handleSubmitIcon = (e) => {
    const upload = iconCollection.insert(
      {
        file: e.target.files[0],
        chunkSize: "dynamic",
      },
      false
    );
    upload.on("start", function () {
      console.log("--start");
    });
    upload.on("end", function (error, fileObj) {
      if (error) {
        console.log(`Error during upload: ${error}`);
      } else {
        const updateData = {
          projectId,
          params: {
            icon: { _id: fileObj._id, path: fileObj.path },
          },
        };
        Meteor.call("projects.update", updateData, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log("project updated");
          }
        });
      }
    });

    upload.start();
  };
  const bundleInputRef = useRef();
  const handleComfirm = async () => {
    const updateData = {
      projectId,
      params: {
        boundleId: bundleInputRef.current.value,
      },
    };
    await Meteor.call("projects.update", updateData, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("project updated");
      }
    });
    await setModifyingBundle(false);
  };
  const currentProject = useTracker(
    () => ProjectsCollection.findOne({ _id: projectId }) || {}
  );
  const splashInstance = useTracker(() =>
    splashCollection.findOne({ _id: currentProject?.splash?._id })
  );
  const iconInstance = useTracker(() =>
    iconCollection.findOne({ _id: currentProject?.icon?._id })
  );
  const onGoingTasks = useTracker(() =>
    TasksCollections.findOne({
      project_id: projectId,
      status: { $in: ["running", "pending"] },
    })
  );
  return (
    <div className="flex flex-col">
      <div>
        <label
          htmlFor="project-publish-modal"
          className="btn btn-primary float-right"
          disabled={Boolean(!isEmpty(onGoingTasks))}
        >
          {isEmpty(onGoingTasks) ? "publish new app" : "exists ongoing tasks"}
        </label>
        <input
          ref={modalInputRef}
          type="checkbox"
          id="project-publish-modal"
          className="modal-toggle"
        />
        <PublishModal
          modalInputRef={modalInputRef}
          currentProject={currentProject}
        ></PublishModal>
      </div>

      <div>
        project name:
        <span className="mx-2">{currentProject.project_name}</span>
      </div>
      <div className="divider"></div>
      <div>
        app name:<span className="mx-2">{currentProject.app_name}</span>
      </div>
      <div className="divider"></div>
      <div>
        boundle id:
        <span className="mx-2">
          {modifyingBundle ? (
            <>
              <input
                type="text"
                defaultValue={currentProject.boundleId}
                className="input input-bordered input-info w-full max-w-xs"
                ref={bundleInputRef}
              />
              <button
                className="btn btn-outline"
                onClick={() => {
                  setModifyingBundle(false);
                }}
              >
                cancel
              </button>
              <button className="btn btn-outline" onClick={handleComfirm}>
                confirm
              </button>
            </>
          ) : (
            <>
              {currentProject.boundleId}
              <button
                className="btn btn-outline"
                onClick={() => {
                  setModifyingBundle(true);
                }}
              >
                modify
              </button>
            </>
          )}
        </span>
      </div>
      <div className="divider"></div>
      <div className="flex ">
        <div>
          icon:
          <span className="mx-2">
            <input
              type="file"
              onChange={handleSubmitIcon}
              className="file-input w-full max-w-xs"
            />
            {iconInstance && (
              <img
                className="w-48 h-48"
                alt="splash"
                src={iconInstance.link()}
              ></img>
            )}
          </span>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div>
          splash:
          <span className="mx-2">
            <input
              type="file"
              onChange={handleSubmitSplash}
              className="file-input w-full max-w-xs"
            />
            {splashInstance && (
              <img
                className="w-48 h-48"
                alt="splash"
                src={splashInstance.link()}
              ></img>
            )}
          </span>
        </div>
      </div>
      <div className="divider"></div>
      <ApplicationTable></ApplicationTable>
    </div>
  );
};

export default index;
