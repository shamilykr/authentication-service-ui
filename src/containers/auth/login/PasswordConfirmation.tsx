import React from "react";
import { Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import FormInputText from "components/input-text";
import { SET_PASSWORD } from "constants/messages";
import { UserActions } from "types/generic";
import { ConfirmPasswordSchema } from "../authSchema";
import { LOGO_URL } from "../../../config";
import "./styles.css";

type Props = {
  onSubmitForm: (data: any) => void;
};
const PasswordConfirmation: React.FC<Props> = ({ onSubmitForm }) => {
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(ConfirmPasswordSchema),
  });
  const { handleSubmit } = methods;

  return (
    <div className="containerLogin">
      <div className="logo">
        <img alt="logo" src={LOGO_URL} />
      </div>
      <div className="password-message">{SET_PASSWORD}</div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <FormInputText
            name="password"
            label="Enter Password"
            type="password"
            className="textBox"
            autoComplete="off"
          />
          <FormInputText
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            className="textBox"
            autoComplete="off"
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            className="login-button"
          >
            {UserActions.SUBMIT}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default PasswordConfirmation;
