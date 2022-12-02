import { ApolloError, useMutation, useQuery } from "@apollo/client";
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
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import SideBar from "../../components/side-bar";

const HomePage = () => {
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);
  const navigate = useNavigate();

  const setUsers = useSetRecoilState(allUsersAtom);

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
