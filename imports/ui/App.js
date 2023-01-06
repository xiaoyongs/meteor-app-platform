import React, { useEffect, useState, Fragment } from "react";
import LoginPage from "./Login/Login.js";
import { useTracker } from "meteor/react-meteor-data";
import { BrowserRouter, Route, Routes, Link, Outlet } from "react-router-dom";
import RootComponent from "./Root/index";
import routers from "/imports/router.js";
import { Roles } from "meteor/alanning:roles";
import { isEmpty } from "lodash";
import Download from "/imports/pages/Download";
export const App = () => {
  const user = useTracker(() => Meteor.user());
  const showManage = Roles.userIsInRole(user?._id, ["admin", "manager"]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/" element={<RootComponent showManage={showManage} />}>
          {routers.map((item, index) => {
            if (!isEmpty(item.auth)) {
              if (Roles.userIsInRole(user?._id, item.auth)) {
                return (
                  <Route
                    key={index}
                    path={item.path}
                    element={<item.component />}
                  />
                );
              }
              return;
            }
            return (
              <Route
                key={index}
                path={item.path}
                exact
                element={<item.component />}
              />
            );
          })}
          <Route path=":anything" element={<></>} />
        </Route>
        <Route path="/download/:fileId" element={<Download />} />
      </Routes>
    </BrowserRouter>
  );
};
