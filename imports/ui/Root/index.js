import React, { useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import Header from "./Header";
import Menu from "./Menu";
import { Outlet } from "react-router-dom";
const index = ({ showManage }) => {
  const user = useTracker(() => Meteor.user());
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !Accounts.loggingIn()) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="w-full h-full flex">
      <Menu showManage={showManage}></Menu>
      <div className="flex flex-1 flex-col">
        <Header showManage={showManage}></Header>
        <div className="flex-1 m-2 overflow-auto rounded-xl">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default index;
