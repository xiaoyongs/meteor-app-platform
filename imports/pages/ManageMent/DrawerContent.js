import React, { useState, useRef, useEffect } from "react";
import { isEmpty, debounce } from "lodash";
import { useTracker } from "meteor/react-meteor-data";

import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
const DrawerContent = ({ handleCloseDrawer, users }) => {
  const user = useTracker(() => Meteor.user());

  const usernameRef = useRef();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("default");
  const confirmDisabled = isEmpty(username) || role == "default";
  const handleClose = () => {
    setUsername("");
    setRole("default");
    usernameRef.current.value = "";
    handleCloseDrawer();
  };
  const handleConfirm = () => {
    Meteor.call("users.create", { username, role }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("user created");
      }
    });
    handleCloseDrawer();
  };
  const handleText = (event) => {
    event.persist();
    debounceSetText(event);
  };
  const handleChangeRole = (e) => {
    setRole(e.target.value);
  };
  const debounceSetText = debounce((event) => {
    setUsername(event.target.value);
  }, 500);

  return (
    <div className="drawer-side">
      <label htmlFor="add-user-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 bg-base-200 text-base-content justify-between">
        <div>
          Adding User
          <div className="divider"></div>
          <li>
            <a>username</a>
            <input
              type="text"
              ref={usernameRef}
              onChange={handleText}
              placeholder="please enter username"
              className="input input-bordered w-full max-w-xs"
            />
            {username &&
              !isEmpty(users.find((item) => item.username == username)) && (
                <div className="alert alert-warning shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>username already exists</span>
                  </div>
                </div>
              )}
          </li>
          <div className="divider"></div>
          <li>
            <a>role</a>
            <select
              value={role}
              onChange={handleChangeRole}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="default" disabled>
                Please choose a role
              </option>
              {Roles.userIsInRole(user?._id, ["admin"]) && (
                <option value="manager">manager</option>
              )}
              <option value="developer">developer</option>
            </select>
          </li>
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-outline btn-warning mx-2"
            onClick={handleClose}
          >
            cancel
          </button>
          <button
            className="btn btn-outline btn-success "
            disabled={Boolean(confirmDisabled)}
            onClick={handleConfirm}
          >
            confirm
          </button>
        </div>
      </ul>
    </div>
  );
};

export default DrawerContent;
