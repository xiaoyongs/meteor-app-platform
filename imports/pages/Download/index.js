import React from "react";
import { packageCollection } from "/imports/api/collections/file";
import { useTracker } from "meteor/react-meteor-data";

import { Routes, Route, useParams } from "react-router-dom";
const Download = () => {
  const { fileId } = useParams();

  const packageInstance = useTracker(() =>
    packageCollection.findOne({ _id: fileId })
  );

  return (
    <div>
      <a href={packageInstance?.link()} className="btn btn-primary">
        Download
      </a>
    </div>
  );
};

export default Download;
