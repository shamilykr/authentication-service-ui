import React from "react";
import { styled } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

export interface FormInputProps {
  name: string;
  label: string;
  type: string;
  setValue?: any;
  className?: any;
  defaultText?: string;
  autoComplete?: string;
}

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

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <StyledTextField
          name={name}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          type={type}
          label={label}
          variant="outlined"
          className={className}
          defaultValue={defaultText}
          autoComplete={autoComplete}
        />
      )}
    />
  );
};

export default FormInputText;
