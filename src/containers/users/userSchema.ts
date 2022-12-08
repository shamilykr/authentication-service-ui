import * as yup from "yup";

const AddUserformSchema = yup.object({
  firstName: yup.string().required("First name cannot be empty"),
  lastName: yup
    .string()
    .required("Last name cannot be empty")
    .matches(/^[A-Za-z]+$/, "Must be a name"),
  email: yup.string().email("Invalid email").required("Email cannot be empty"),
  phone: yup.string().required("Phone number cannot be empty"),
});

const EditUserformSchema = yup.object({
  firstName: yup.string().min(2).required("First name cannot be empty"),
  lastName: yup.string().required("Last name cannot be empty"),
});

export { AddUserformSchema, EditUserformSchema };
