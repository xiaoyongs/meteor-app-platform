import React, { useEffect, useState, Fragment } from "react";
import LoginPage from "./Login/Login.js";
import { BrowserRouter, Route, Routes, Link, Outlet } from "react-router-dom";
import RootComponent from "./Root/index";
import routers from "/imports/router.js";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/" element={<RootComponent />}>
          {routers.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                exact
                element={<item.component />}
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
