import React, { useEffect, useRef, useState } from "react";
import ProjectsTable from "./ProjectsTable";
import { useTracker } from "meteor/react-meteor-data";
import DrawerContent from "./DrawerContent";
import { ProjectsCollection } from "../../api/collections/projects";
const index = () => {
  const drawerCheckRef = useRef();
  const handleCloseDrawer = () => {
    drawerCheckRef.current.checked = false;
  };
  const projectsList = useTracker(() => ProjectsCollection.find().fetch());
  return (
    <div className="drawer drawer-end  w-full h-full ">
      <input
        id="create-project-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckRef}
      />
      <div className="drawer-content flex flex-col">
        <div>
          <label
            htmlFor="create-project-drawer"
            className="drawer-button btn btn-primary float-right	"
          >
            New Project
          </label>
        </div>
        <ProjectsTable projectsList={projectsList} />
      </div>
      <DrawerContent handleCloseDrawer={handleCloseDrawer} />
    </div>
  );
};

export default index;
