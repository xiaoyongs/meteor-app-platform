import React, { useState, useRef, useEffect } from "react";
import { isEmpty, debounce } from "lodash";
import { Meteor } from "meteor/meteor";
import { useFormik } from "formik";

const DrawerContent = ({ handleCloseDrawer }) => {
  const projectForm = useFormik({
    initialValues: {
      project_name: "",
      app_name: "",
    },
    onSubmit: (values) => {
      Meteor.call("projects.create", values, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("project created");
        }
      });
      projectForm.resetForm();
    },
  });
  const handleCancel = async () => {
    await projectForm.resetForm();
    await handleCloseDrawer();
  };
  const handleSubmit = async () => {
    await projectForm.handleSubmit();
    await handleCloseDrawer();
  };
  return (
    <div className="drawer-side">
      <label htmlFor="create-project-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 bg-base-200 text-base-content justify-between">
        <div>
          New Project
          <div className="divider"></div>
          <li>
            <a>Project Name</a>
            <input
              name="project_name"
              type="text"
              placeholder="please enter ProjectName"
              className="input input-bordered w-full max-w-xs"
              onChange={projectForm.handleChange}
              value={projectForm.values.project_name}
            />
          </li>
          <div className="divider"></div>
          <li>
            <a>App Name</a>
            <input
              name="app_name"
              type="text"
              placeholder="please enter AppName"
              onChange={projectForm.handleChange}
              value={projectForm.values.app_name}
              className="input input-bordered w-full max-w-xs"
            />
          </li>
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-outline btn-warning mx-2"
            onClick={handleCancel}
          >
            cancel
          </button>
          <button
            className="btn btn-outline btn-success "
            onClick={handleSubmit}
          >
            confirm
          </button>
        </div>
      </ul>
    </div>
  );
};

export default DrawerContent;
