import React from "react";
import { isEmpty } from "lodash";
const UserTable = ({ users = [], roleAssignment = [], projectsList = [] }) => {
  const mapRoleToUser = (user, relation) => {
    const result = relation.find((item) => {
      return item.user._id == user._id;
    })?.role?._id;
    return result;
  };
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th>Role</th>
            <th>Projects</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {users.map((person, index) => {
            return (
              <tr key={index} className="hover">
                <th>{index + 1}</th>
                <td>{person.username}</td>
                <td>{mapRoleToUser(person, roleAssignment)}</td>
                <td>
                  {person.username == "admin"
                    ? "All"
                    : projectsList
                        .filter(
                          (i) =>
                            !isEmpty(
                              i.managers.find((j) => j._id == person._id)
                            )
                        )
                        .map((project) => (
                          <div className="badge badge-accent mx-2">
                            {project.project_name}
                          </div>
                        ))}
                </td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
