import React from "react";
import { iconCollection } from "/imports/api/collections/file";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const ApplicationTable = ({ completedTasks }) => {
  const navigate = useNavigate();
  const handleNavigateDownload = (fileId) => {
    navigate(`/download/${fileId}`);
  };
  const copyDownloadPath = (fileId) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/download/${fileId}`
    );
  };
  return (
    <div>
      <div className="mb-2">Application Table</div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>应用名称</th>
              <th>版本</th>
              <th>下载地址</th>
              <th>二维码</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex">
                    <div className="avatar mr-2">
                      <div className="w-16 rounded">
                        <img
                          className="w-32 h-32"
                          alt="splash"
                          src={iconCollection
                            .findOne({ _id: item?.config?.icon?._id })
                            .link()}
                        ></img>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between	">
                      <p>app name: {item?.config?.app_name}</p>
                      <p>platform: {item?.platform}</p>
                    </div>
                  </div>
                </td>
                <td>{item?.config?.version}</td>
                <td>
                  <div className="flex w-full">
                    <button
                      className="btn btn-accent"
                      onClick={() => copyDownloadPath(item?.output?._id)}
                    >
                      copy
                    </button>
                    <div className="divider lg:divider-horizontal"></div>
                    <button
                      className="btn btn-info"
                      onClick={() => handleNavigateDownload(item?.output?._id)}
                    >
                      redirect
                    </button>
                  </div>
                </td>
                <td>
                  <QRCodeSVG
                    value={`${window.location.origin}/download/${item?.output?._id}`}
                  ></QRCodeSVG>
                </td>
                <td>{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTable;
