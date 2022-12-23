import React from "react";

const ProjectsTable = ({ projectsList = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Project Name</th>
            <th>App Name</th>

            <th>Managers</th>
            <th>Create Time</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {projectsList.map((item, index) => {
            return (
              <tr key={index} className="hover">
                <th>{index + 1}</th>
                <td>{item.project_name}</td>
                <td>{item.app_name}</td>
                <td>{item.managers.map((person) => person.username)}</td>
                <td>{item.createdAt}</td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
