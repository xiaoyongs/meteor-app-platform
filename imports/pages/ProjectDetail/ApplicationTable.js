import React from "react";

const ApplicationTable = () => {
  return (
    <div>
      <div className="mb-2">Application Table</div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>应用名称</th>
              <th>版本</th>
              <th>url</th>
              <th>二维码</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTable;
