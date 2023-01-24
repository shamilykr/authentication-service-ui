import { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Avatar, Divider } from "@mui/material";
import { useRecoilState } from "recoil";
import CircularProgress from "@mui/material/CircularProgress";
import { useMediaQuery } from "react-responsive";

import { stringAvatar } from "utils/table";
import Toast from "components/toast";
import If from "components/if";
import SideBar from "components/side-bar";
import { toastMessageAtom } from "states/apiRequestState";
import {
  IsViewGroupsVerifiedAtom,
  IsViewPermissionsVerifiedAtom,
  IsViewRolesVerifiedAtom,
  IsViewUsersVerifiedAtom,
  IsViewEntitiesVerifiedAtom,
  UserPermissionsAtom,
} from "states/permissionsStates";
import { groupListAtom } from "states/groupStates";
import { currentUserAtom } from "states/loginStates";
import { GET_GROUPS } from "services/queries/groupQueries";
import CustomerAuth from "services/auth";
import { LOGOUT } from "services/mutations/authMutations";
import { GET_CURRENT_USER } from "services/queries/authQueries";
import { ReactComponent as ArrowIcon } from "assets/sub-header-icons/arrow.svg";
import { ReactComponent as SettingsIcon } from "assets/sidebar-icons/settings.svg";
import {
  VIEW_GROUP_PERMISSION,
  VIEW_ROLE_PERMISSION,
  VIEW_USER_PERMISSION,
  VIEW_ENTITY_PERMISSION,
  VIEW_PERMISSIONS_PERMISSION,
} from "constants/permissions";
import { useCustomMutation } from "hooks/useMutation";
import { UserActions } from "types/generic";
import { getHeader } from "utils/routes";
import { RoutePaths } from "constants/routes";
import { useCustomLazyQuery } from "hooks/useLazyQuery";
import Settings from "components/settings";
import { LOGO_URL, MINI_LOGO_URL } from "../../config";
import "./styles.css";

const HomePage = () => {
  const [currentUserDetails, setCurrentUserDetails] =
    useRecoilState(currentUserAtom);
  const [userPermissions, setUserPermissions] =
    useRecoilState(UserPermissionsAtom);
  const setGroupList = useSetRecoilState(groupListAtom);
  const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
  const onGetCurrentUserCompleted = (data: any) => {
    setCurrentUserDetails(data.getCurrentUser);
    setUserPermissions(data.getCurrentUser?.permissions);
  };

  const { lazyQuery: getGroups, loading } = useCustomLazyQuery(
    GET_GROUPS,
    onGetGroupsComplete
  );
  const { lazyQuery: getCurrentUser, loading: currentUserLoading } =
    useCustomLazyQuery(GET_CURRENT_USER, onGetCurrentUserCompleted);

  useEffect(() => {
    getCurrentUser(); // eslint-disable-next-line
  }, []);

  const isDesktopScreen = useMediaQuery({ query: "(min-width: 1200px)" });

  useEffect(() => {
    if (userPermissions) {
      userPermissions.forEach((item: any) => {
        if (item?.name.includes(VIEW_USER_PERMISSION)) {
          setIsViewUsersVerified(true);
        }
        if (item?.name.includes(VIEW_GROUP_PERMISSION)) {
          setIsViewGroupsVerified(true);
          if (window.location.hash === "#/home/users") getGroups();
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
    navigate(RoutePaths.login);
  };

  const [logout] = useCustomMutation(LOGOUT, onLogoutCompleted);

  const navLogo = {
    image: isDesktopScreen ? LOGO_URL : MINI_LOGO_URL,
    width: isDesktopScreen ? "170px" : "24%",
  };

  const handleRedirection = (path: string) => {
    let redirectUrl = RoutePaths.usersUrl;
    redirectUrl =
      path === "groups"
        ? RoutePaths.groupsUrl
        : path === "roles"
        ? RoutePaths.rolesUrl
        : redirectUrl;
    navigate(redirectUrl);
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="wrapperContainer">
        <div className="body">
          <div className="sideBar">
            <div className="navBar">
              <div className="navLogo">
                <img
                  alt="logo"
                  src={navLogo.image}
                  style={{ width: navLogo.width }}
                />
              </div>
            </div>
            <div className="nav-user-details">
              <SideBar />
              <div>
                <Divider />
                <If condition={currentUserDetails.firstName}>
                  {isDesktopScreen ? (
                    <div className="userdetails">
                      <Avatar
                        {...stringAvatar(
                          `${currentUserDetails.firstName} ${currentUserDetails.lastName}`?.toUpperCase()
                        )}
                        className="user-avatar-desktop"
                      />
                      <div className="name-logout">
                        <div className="username">{`${currentUserDetails.firstName} ${currentUserDetails.lastName}`}</div>
                        <div onClick={onLogout} className="logout">
                          {UserActions.LOGOUT}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="userdetails-tablet">
                      <SettingsIcon
                        id="settings-icon"
                        onClick={(e: any) => {
                          handleClick(e);
                        }}
                      />
                      {open && (
                        <Settings
                          initials={stringAvatar(
                            `${currentUserDetails.firstName} ${currentUserDetails.lastName}`?.toUpperCase()
                          )}
                          fullName={`${currentUserDetails.firstName} ${currentUserDetails.lastName}`}
                          anchorEl={anchorEl}
                          handleClose={handleClose}
                          email={currentUserDetails.email}
                          onLogoutCompleted={onLogoutCompleted}
                        />
                      )}
                    </div>
                  )}
                </If>
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
                !loading && !currentUserLoading ? (
                  <Outlet />
                ) : (
                  <CircularProgress />
                )
              ) : (
                <Navigate replace to={RoutePaths.login} />
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
