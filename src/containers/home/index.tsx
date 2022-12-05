import {
  ApolloError,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Avatar, Divider } from "@mui/material";
import { useRecoilState } from "recoil";

import { LOGO_URL } from "../../config";
import CustomerAuth from "../../services/auth";
import "./styles.css";
import { LOGOUT } from "../auth/services/mutations";
import { GET_USERS } from "../users/services/queries";
import { allUsersAtom } from "../../states/userStates";
import { currentUserAtom } from "../../states/loginStates";
import { stringAvatar } from "../../utils/table";
import Toast from "../../components/toast";
import { apiRequestAtom, toastMessageAtom } from "../../states/apiRequestState";
import {
  IsViewGroupsVerifiedAtom,
  IsViewPermissionsVerifiedAtom,
  IsViewRolesVerifiedAtom,
  IsViewUsersVerifiedAtom,
} from "../../states/permissionsStates";
import { VERIFY_USER_PERMISSION } from "../../components/table/services/queries";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import SideBar from "../../components/side-bar";

const HomePage = () => {
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);
  const navigate = useNavigate();

  const setUsers = useSetRecoilState(allUsersAtom);

  const setIsViewUsersVerified = useSetRecoilState(IsViewUsersVerifiedAtom);
  const setIsViewGroupsVerified = useSetRecoilState(IsViewGroupsVerifiedAtom);
  const setIsViewRolesVerified = useSetRecoilState(IsViewRolesVerifiedAtom);
  const setIsViewPermissionsVerified = useSetRecoilState(
    IsViewPermissionsVerifiedAtom
  );

  const [verifyViewUser] = useLazyQuery(VERIFY_USER_PERMISSION, {
    variables: {
      params: {
        permissions: ["view-user"],
        operation: "AND",
      },
    },
    onCompleted: (data) => {
      setIsViewUsersVerified(data?.verifyUserPermission);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  const [verifyViewGroups] = useLazyQuery(VERIFY_USER_PERMISSION, {
    variables: {
      params: {
        permissions: ["view-groups"],
        operation: "AND",
      },
    },
    onCompleted: (data) => {
      setIsViewGroupsVerified(data?.verifyUserPermission);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  const [verifyViewRoles] = useLazyQuery(VERIFY_USER_PERMISSION, {
    variables: {
      params: {
        permissions: ["view-roles"],
        operation: "AND",
      },
    },
    onCompleted: (data) => {
      setIsViewRolesVerified(data?.verifyUserPermission);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  const [verifyViewPermissions] = useLazyQuery(VERIFY_USER_PERMISSION, {
    variables: {
      params: {
        permissions: ["view-permissions"],
        operation: "AND",
      },
    },
    onCompleted: (data) => {
      setIsViewPermissionsVerified(data?.verifyUserPermission);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
    fetchPolicy: "network-only",
  });

  useQuery(GET_USERS, {
    onCompleted: (data) => {
      setUsers(data?.getUsers);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });
  const [currentUserDetails] = useRecoilState(currentUserAtom);

  useEffect(() => {
    verifyViewUser();
    verifyViewGroups();
    verifyViewRoles();
    verifyViewPermissions();
  }, [currentUserDetails.permissions]);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      CustomerAuth.clearTokens();
      navigate("/login");
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });

  const onLogout = () => {
    logout();
  };

  const onCloseToast = () => {
    setToastMessage("");
  };
  return (
    <>
      <div className="wrapperContainer">
        <div className="body">
          <div className="sideBar">
            <div className="navBar">
              <div className="navLogo">
                <img alt="logo" src={LOGO_URL} style={{ width: "170px" }} />
              </div>
              <div className="menu-icon">
                <MenuIcon />
              </div>
            </div>
            <div className="nav-user-details">
              <SideBar />
              <div>
                <Divider />
                <div className="userdetails">
                  <Avatar
                    {...stringAvatar(
                      `${currentUserDetails.firstName} ${currentUserDetails.lastName}`?.toUpperCase()
                    )}
                  />
                  <div className="name-logout">
                    <div className="username">{`${currentUserDetails.firstName} ${currentUserDetails.lastName}`}</div>
                    <div onClick={onLogout} className="logout">
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="outlet">
            {CustomerAuth?.isAuthenticated ? (
              <Outlet />
            ) : (
              <Navigate replace to="/login" />
            )}
          </div>
          <Toast
            message={toastMessage}
            isOpen={Boolean(toastMessage)}
            handleClose={onCloseToast}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
