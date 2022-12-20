import { useLazyQuery } from "@apollo/client";
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
import { currentUserAtom } from "states/loginStates";
import { stringAvatar } from "utils/table";
import Toast from "components/toast";
import { toastMessageAtom } from "states/apiRequestState";
import {
  IsViewGroupsVerifiedAtom,
  IsViewPermissionsVerifiedAtom,
  IsViewRolesVerifiedAtom,
  IsViewUsersVerifiedAtom,
  IsViewEntitiesVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import { ReactComponent as MenuIcon } from "assets/menu.svg";
import SideBar from "components/side-bar";
import { groupListAtom } from "states/groupStates";
import { GET_GROUPS } from "../groups/services/queries";
import { ReactComponent as ArrowIcon } from "assets/arrow.svg";
import {
  VIEW_GROUP_PERMISSION,
  VIEW_ROLE_PERMISSION,
  VIEW_USER_PERMISSION,
  VIEW_ENTITY_PERMISSION,
  VIEW_PERMISSIONS_PERMISSION,
} from "constants/permissions";
import { useCustomMutation } from "hooks/useMutation";
import { GET_CURRENT_USER } from "containers/auth/services/queries";

const HomePage = () => {
  const [currentUserDetails, setCurrentUserDetails] =
    useRecoilState(currentUserAtom);
  const [userPermissions, setUserPermissions] =
    useRecoilState(UserPermissionsAtom);

  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER, {
    onCompleted: (data) => {
      setCurrentUserDetails(data.getCurrentUser);
      setUserPermissions(data.getCurrentUser?.permissions);
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getCurrentUser();
  }, []);
  const setGroupList = useSetRecoilState(groupListAtom);
  const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);
  const navigate = useNavigate();

  const setIsViewUsersVerified = useSetRecoilState(IsViewUsersVerifiedAtom);
  const setIsViewGroupsVerified = useSetRecoilState(IsViewGroupsVerifiedAtom);
  const setIsViewRolesVerified = useSetRecoilState(IsViewRolesVerifiedAtom);
  const setIsViewPermissionsVerified = useSetRecoilState(
    IsViewPermissionsVerifiedAtom
  );
  const setisViewEntitiesVerified = useSetRecoilState(
    IsViewEntitiesVerifiedAtom
  );
  const onGetGroupsComplete = (data: any) => {
    setGroupList(data?.getGroups?.results);
  };

  const [getGroups, { loading }] = useLazyQuery(GET_GROUPS, {
    onCompleted: (data) => {
      onGetGroupsComplete(data);
    },
  });
  useEffect(() => {
    if (userPermissions) {
      userPermissions.forEach((item: any) => {
        if (item?.name.includes(VIEW_USER_PERMISSION)) {
          setIsViewUsersVerified(true);
        }
        if (item?.name.includes(VIEW_GROUP_PERMISSION)) {
          setIsViewGroupsVerified(true);
          getGroups();
        }
        if (item?.name.includes(VIEW_ROLE_PERMISSION)) {
          setIsViewRolesVerified(true);
        }
        if (item?.name.includes(VIEW_PERMISSIONS_PERMISSION)) {
          setIsViewPermissionsVerified(true);
        }
        if (item?.name.includes(VIEW_ENTITY_PERMISSION)) {
          setisViewEntitiesVerified(true);
        }
      });
    }
  }, [
    userPermissions,
    getGroups,
    setIsViewUsersVerified,
    setIsViewGroupsVerified,
    setIsViewPermissionsVerified,
    setisViewEntitiesVerified,
    setIsViewRolesVerified,
  ]);

  const onLogoutCompleted = () => {
    CustomerAuth.clearTokens();
    setCurrentUserDetails([]);
    setUserPermissions([]);
    setIsViewGroupsVerified(false);
    setIsViewUsersVerified(false);
    setIsViewPermissionsVerified(false);
    setisViewEntitiesVerified(false);
    setIsViewRolesVerified(false);
    navigate("/login");
  };
  const [logout] = useCustomMutation(LOGOUT, onLogoutCompleted);

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
    let pathnameArray: string[] = [];
    if (window?.location?.hash.includes("home")) {
      pathnameArray = window?.location?.hash?.split("home")?.[1]?.split("/");

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
                !loading ? (
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
