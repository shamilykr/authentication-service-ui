import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FieldValues } from "react-hook-form";

import { LOGIN, SET_PASSWORD } from "services/mutations/authMutations";
import CustomerAuth from "services/auth";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import { IsViewUsersVerifiedAtom } from "states/permissionsStates";
import Toast from "components/toast";
import { PASSWORD_SET_MESSAGE } from "constants/messages";
import { useCustomMutation } from "hooks/useMutation";
import { VIEW_USER_PERMISSION } from "constants/permissions";
import { RoutePaths } from "constants/routes";
import { LOGIN_URL } from "../../../config";
import "./styles.css";
import LoginPassword from "./loginPassword";
import PasswordConfirmation from "./PasswordConfirmation";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setIsViewUsersVerified = useSetRecoilState(IsViewUsersVerifiedAtom);

  const inviteToken: string | null = searchParams.get("token");

  const [userLogin, { data }] = useCustomMutation(LOGIN);

  const [setPassword, { data: passwordCreatedData }] =
    useCustomMutation(SET_PASSWORD);

  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);

  useEffect(() => {
    if (data) {
      const { accessToken, refreshToken, user } = data.passwordLogin;
      CustomerAuth.setTokens({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      if (user?.permissions) {
        user?.permissions.forEach((item: any) => {
          if (item?.name.includes(VIEW_USER_PERMISSION)) {
            setIsViewUsersVerified(true);
          }
        });
      }
      navigate(RoutePaths.usersUrl);
    } // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (passwordCreatedData)
      setTimeout(() => {
        navigate(RoutePaths.default);
      }, 1000); // eslint-disable-next-line
  }, [passwordCreatedData]);

  const onLogin = (data: FieldValues) => {
    userLogin({
      variables: {
        input: data,
      },
    });
  };

  const onConfirmPassword = (data: FieldValues) => {
    setPassword({
      variables: {
        input: { inviteToken, password: data?.password },
      },
      fetchPolicy: "no-cache",
    });
    setToastMessage(PASSWORD_SET_MESSAGE);
    setApiSuccess(true);
  };

  const getInputFields = () => {
    if (inviteToken)
      return <PasswordConfirmation onSubmitForm={onConfirmPassword} />;
    else return <LoginPassword onSubmitForm={onLogin} />;
  };

  const onCloseToast = () => {
    setToastMessage("");
  };

  return (
    <div className="login-page">
      <div className="left">
        {" "}
        {/* eslint-disable-next-line*/}
        <img src={LOGIN_URL} alt="login image" id="login-image" />
      </div>
      <div className="input-container">{getInputFields()}</div>
      <Toast
        message={toastMessage}
        isOpen={Boolean(toastMessage)}
        handleClose={onCloseToast}
      />
    </div>
  );
};

export default Login;
