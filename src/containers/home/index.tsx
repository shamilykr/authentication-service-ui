import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Avatar, Divider } from "@mui/material";
import { useRecoilState } from "recoil";
import CircularProgress from "@mui/material/CircularProgress";

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
import { groupListAtom } from "../../states/groupStates";
import { GET_GROUPS } from "../groups/services/queries";
import { ReactComponent as ArrowIcon } from "../../assets/arrow.svg";
import {
  VIEW_GROUP_PERMISSION,
  VIEW_ROLE_PERMISSION,
  VIEW_USER_PERMISSION,
} from "../../constants/permissions";
import { useCustomQuery } from "../../hooks/useQuery";

const HomePage = () => {
  const setGroupList = useSetRecoilState(groupListAtom);
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

  const [verifyViewUser, { loading: userLoading }] = useLazyQuery(
    VERIFY_USER_PERMISSION,
    {
      variables: {
        params: {
          permissions: [VIEW_USER_PERMISSION],
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
    }
  );

  const [verifyViewGroups, { loading: groupLoading }] = useLazyQuery(
    VERIFY_USER_PERMISSION,
    {
      variables: {
        params: {
          permissions: [VIEW_GROUP_PERMISSION],
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
    }
  );

  const [verifyViewRoles, { loading: roleLoading }] = useLazyQuery(
    VERIFY_USER_PERMISSION,
    {
      variables: {
        params: {
          permissions: [VIEW_ROLE_PERMISSION],
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
    }
  );

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

  const onGetUsers = (data: any) => {
    setUsers(data?.getUsers);
  };

  useCustomQuery(GET_USERS, onGetUsers);

  const onGetGroupsComplete = (data: any) => {
    setGroupList(data?.getGroups);
  };

  useCustomQuery(GET_GROUPS, onGetGroupsComplete);

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
  const handleRedirection = (path: string) => {
    let redirectUrl = "/home/users";
    redirectUrl =
      path === "groups"
        ? "/home/groups"
        : path === "roles"
        ? "/home/roles"
        : redirectUrl;
    navigate(redirectUrl);
  };
  const getHeader = () => {
    const pathnameArray = window?.location?.hash
      ?.split("home")?.[1]
      ?.split("/");
    if (pathnameArray?.length === 4) {
      return `Modify ${pathnameArray[1]}`;
    } else if (pathnameArray[2] === "add") {
      return `Add ${pathnameArray[1]}`;
    } else if (pathnameArray?.length === 3 && pathnameArray[2] !== "add") {
      return `View ${pathnameArray[1]}`;
    } else if (pathnameArray?.length === 2) {
      return (
        pathnameArray[1]?.charAt(0).toUpperCase() + pathnameArray[1].slice(1)
      );
    }
  };
  const getSubHeader = () => {
    const pathnameArray = window?.location?.hash
      ?.split("home")?.[1]
      ?.split("/");
    if (pathnameArray?.length > 2) {
      return (
        <div className="nav-sub-header-wrapper nav-sub-header">
          <div
            className="nav-sub-header-active"
            onClick={() => handleRedirection(pathnameArray[1])}
          >
            {pathnameArray[1]?.charAt(0).toUpperCase() +
              pathnameArray[1].slice(1)}
          </div>
          <ArrowIcon className="nav-bar-icon" />
          <div>{getHeader()}</div>
        </div>
      );
    } else return null;
  };
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
          <div className="nav-outlet">
            <div className="nav">
              <div className="nav-header-wrap">
                {getSubHeader()}
                <div className="nav-header">{getHeader()}</div>
              </div>
            </div>
            <div className="outlet">
              {CustomerAuth?.isAuthenticated ? (
                !userLoading && !groupLoading && !roleLoading ? (
                  <Outlet />
                ) : (
                  <CircularProgress />
                )
              ) : (
                <Navigate replace to="/login" />
              )}
            </div>
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
