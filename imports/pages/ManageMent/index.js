import React, { useEffect, useRef, useState } from "react";
import UserTable from "./UserTable";
import { useTracker } from "meteor/react-meteor-data";
import DrawerContent from "./DrawerContent";
import { ProjectsCollection } from "/imports/api/collections/projects";
const index = () => {
  const users = useTracker(() => Meteor.users.find().fetch());
  const roleAssignment = useTracker(() => Meteor.roleAssignment.find().fetch());
  const projectsList = useTracker(() => ProjectsCollection.find().fetch());

  const drawerCheckRef = useRef();
  const handleCloseDrawer = () => {
    drawerCheckRef.current.checked = false;
  };
  return (
    <div className="drawer drawer-end  w-full h-full ">
      <input
        id="add-user-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckRef}
      />
      <div className="drawer-content flex flex-col">
        <div>
          <label
            htmlFor="add-user-drawer"
            className="drawer-button btn btn-primary float-right	"
          >
            add user
          </label>
        </div>
        <UserTable
          users={users}
          roleAssignment={roleAssignment}
          projectsList={projectsList}
        />
      </div>
      <DrawerContent handleCloseDrawer={handleCloseDrawer} users={users} />
    </div>
  );
};

export default index;
