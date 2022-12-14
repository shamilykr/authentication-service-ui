import * as yup from "yup";

const AddUserformSchema = yup.object({
  firstName: yup.string().required("First name cannot be empty"),
  lastName: yup
    .string()
    .required("Last name cannot be empty")
    .matches(/^[A-Za-z]+$/, "Must be a name"),
  email: yup.string().email("Invalid email").required("Email cannot be empty"),
  phone: yup
    .number()
    .required("Phone number cannot be empty")
    .typeError("Must be a number"),
});

const EditUserformSchema = yup.object({
  firstName: yup.string().min(1, "First name cannot be empty"),
  lastName: yup.string().min(1, "Last name cannot be empty"),
});

export { AddUserformSchema, EditUserformSchema };
