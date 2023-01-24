import { styled } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { FormInputProps } from "./types";
import { submitAtom } from "states/submitStates";

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#2F6FED",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#2F6FED",
    },
    "&:hover fieldset": {
      borderColor: "#2F6FED",
    },
    fontFamily: "Manrope",
  },
});

const FormInputText = ({
  name,
  label,
  type,
  className,
  defaultText,
  autoComplete,
}: FormInputProps) => {
  const { control } = useFormContext();
  const setSubmitButton = useSetRecoilState(submitAtom);
  useEffect(() => {
    return () => setSubmitButton(false);
  }, []);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <StyledTextField
          name={name}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={(e: any) => {
            onChange(e);
            setSubmitButton(true);
          }}
          fullWidth
          type={type}
          label={label}
          variant="outlined"
          className={className}
          defaultValue={value ? value : defaultText}
          autoComplete={autoComplete}
        />
      )}
    />
  );
};

export default FormInputText;
