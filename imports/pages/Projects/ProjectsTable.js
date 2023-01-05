import React from "react";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
const ProjectsTable = ({ user, projectsList = [] }) => {
  const navigate = useNavigate();
  const handleNavigate = (item) => (e) => {
    console.log(item);
    navigate(`/projects/detail/${item._id}`);
  };
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Project Name</th>
            <th>App Name</th>

            <th>Managers</th>
            <th>Members</th>
            <th>Create Time</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {projectsList.map((item, index) => {
            if (
              Roles.userIsInRole(user?._id, ["admin"]) ||
              (item.managers &&
                !isEmpty(item.managers.find((i) => i._id == user?._id))) ||
              (item.members &&
                !isEmpty(item.members.find((i) => i._id == user?._id)))
            ) {
              return (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>{item.project_name}</td>
                  <td>{item.app_name}</td>
                  <td>
                    {item.managers &&
                      item.managers.map((person) => person.username)}
                  </td>
                  <td>
                    {item.members &&
                      item.members.map((person) => person.username)}
                  </td>
                  <td>{item.createdAt}</td>
                  <td>
                    <input
                      type="button"
                      value="detail"
                      className="btn"
                      onClick={handleNavigate(item)}
                    />
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
