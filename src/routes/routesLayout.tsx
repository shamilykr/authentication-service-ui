import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import UserDetails from "../containers/users/components/user-details/UserDetails";
import CreateOrEditRole from "../containers/roles/components/create-edit/CreateOrEditRole";
import AddUser from "../containers/users/components/create-edit-user/AddUser";
import EditUser from "../containers/users/components/create-edit-user/EditUser";
import { RoutePaths } from "constants/routes";
import CreateOrEditGroup from "../containers/groups/components/create-edit/CreateEditGroup";

const NotFound = lazy(() => import("../components/NotFound"));
const HomePage = lazy(() => import("../containers/home"));
const Login = lazy(() => import("../containers/auth/login"));
const Users = lazy(() => import("../containers/users"));
const Groups = lazy(() => import("../containers/groups"));
const Roles = lazy(() => import("../containers/roles"));

const RoutesLayout: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path={RoutePaths.default}
          element={<Navigate replace to={RoutePaths.login} />}
        />
        <Route path={RoutePaths.login} element={<Login />} />
        <Route path={RoutePaths.confirmpassword} element={<Login />} />
        <Route path={RoutePaths.homeUrl} element={<HomePage />}>
          <Route path={RoutePaths.users} element={<Users />} />
          <Route path={RoutePaths.userDetail} element={<UserDetails />}></Route>
          <Route path={RoutePaths.addUser} element={<AddUser />} />
          <Route path={RoutePaths.editUser} element={<EditUser />} />
          <Route path={RoutePaths.groups} element={<Groups />} />
          <Route
            path={RoutePaths.addGroup}
            element={<CreateOrEditGroup />}
          ></Route>
          <Route
            path={RoutePaths.editGroup}
            element={<CreateOrEditGroup />}
          ></Route>
          <Route path={RoutePaths.roles} element={<Roles />} />
          <Route
            path={RoutePaths.addRole}
            element={<CreateOrEditRole />}
          ></Route>
          <Route
            path={RoutePaths.editRole}
            element={<CreateOrEditRole />}
          ></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RoutesLayout;
