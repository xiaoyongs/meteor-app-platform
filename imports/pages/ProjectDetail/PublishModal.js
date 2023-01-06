import React, { useState } from "react";
import { buildCollection } from "/imports/api/collections/file";
import { isEmpty } from "lodash";
const PublishModal = ({ modalInputRef, projectId, currentProject }) => {
  const [buildFile, setBuildFile] = useState({});
  const [version, setVersion] = useState("");
  const handleBuildFile = (e) => {
    const upload = buildCollection.insert(
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
        setBuildFile(fileObj);
        console.log(fileObj, "success");
      }
    });

    upload.start();
  };
  const startPublish = () => {
    Meteor.call("projects.publishAndroid", {
      config: {
        buildFile: { _id: buildFile._id, path: buildFile.path },
        version,
        ...currentProject,
      },
    });
    modalInputRef.current.checked = false;
  };
  return (
    <div className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Publish Your App</h3>
        <p className="py-4">
          version:
          <input
            type="text"
            className="file-input w-full max-w-xs"
            value={version}
            onChange={(e) => {
              setVersion(e.target.value);
            }}
          />
        </p>
        <p className="py-4">
          upload zipped build file:
          <input
            type="file"
            className="file-input w-full max-w-xs"
            onChange={handleBuildFile}
          />
        </p>
        <div className="modal-action">
          <label htmlFor="project-publish-modal" className="btn">
            cancel
          </label>
          <button
            className="btn btn-outline"
            disabled={Boolean(isEmpty(version) || isEmpty(buildFile))}
            onClick={startPublish}
          >
            start
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
