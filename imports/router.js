import HomePage from "/imports/pages/Homepage/index";
import Projects from "/imports/pages/Projects/index";
import ManageMent from "/imports/pages/ManageMent/index";
export default [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/projects",
    component: Projects,
  },
  { path: "/manage", component: ManageMent, auth: ["admin", "manager"] },
];
