import * as yup from "yup";
import { GridColumns } from "@mui/x-data-grid";
import { Avatar } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import styled from "@emotion/styled";

import TableChipElement from "components/table-chip-element";
import StatusChip from "components/status-chip";
import { stringAvatar } from "utils/table";

export const UserDetails = styled.div<{ desktopScreen: boolean }>`
  margin-left: ${(props) => !props.desktopScreen && "-5px"};
  margin-top: ${(props) => !props.desktopScreen && "-3px"};
`;
const phoneRegExp = /^\d{10}$/;

export const AddUserformSchema = yup.object({
  firstName: yup
    .string()
    .required("First name cannot be empty")
    .max(40, "First name must not exceed 40 characters"),
  lastName: yup
    .string()
    .required("Last name cannot be empty")
    .matches(/^[A-Za-z]+$/, "Must be a name")
    .max(40, "Last name must not exceed 40 characters"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email cannot be empty")
    .max(40),
  phone: yup
    .string()
    .required("Phone number cannot be empty")
    .matches(phoneRegExp, "Invalid phone number")
    .typeError("Must be a number"),
});

export const EditUserformSchema = yup.object({
  firstName: yup
    .string()
    .min(1, "First name cannot be empty")
    .max(40, "First name must not exceed 40 characters"),
  lastName: yup
    .string()
    .min(1, "Last name cannot be empty")
    .max(40, "Last name must not exceed 40 characters"),
});

export const getFullName = (
  firstName: string,
  lastName: string,
  middleName?: string
) => {
  return middleName
    ? `${firstName || ""} ${middleName || ""} ${lastName || ""} `
    : `${firstName || ""} ${lastName || ""} `;
};

const GetFullName = (props: any) => {
  const { row } = props;
  const isDesktopScreen = useMediaQuery({ query: "(min-height: 980px)" });

  return (
    <>
      <Avatar
        {...stringAvatar(`${row.firstName} ${row.lastName}`?.toUpperCase())}
        className={row.status !== "INVITED" ? "avatar" : "blurred-avatar"}
      />
      <UserDetails desktopScreen={isDesktopScreen}>
        <div
          className={row.status !== "INVITED" ? "fullname" : "blurred-fullname"}
        >{`${row.firstName} ${row.lastName}`}</div>
        <div className={row.status !== "INVITED" ? "email" : "blurred-email"}>
          {row.email}
        </div>
      </UserDetails>
    </>
  );
};

export const columns: GridColumns = [
  {
    field: "firstName",
    headerName: "User",
    flex: 0.3,
    headerClassName: "user-list-header-name",
    headerAlign: "left",
    renderCell: (params) => (
      <div className="username-column">
        <GetFullName {...params} />
      </div>
    ),
    sortable: false,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "user-list-header",
    flex: 0.5,
    renderCell: (params) => (
      <div className="group-list">
        <TableChipElement
          rowItems={params}
          columnName="groups"
          defaultSize={3}
        />
      </div>
    ),
    headerAlign: "left",
    sortable: false,
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "status-header",
    flex: 0.21,
    renderCell: (params) => (
      <div className="access-column">
        {/* @ts-ignore */}
        <StatusChip {...params} />
      </div>
    ),
    headerAlign: "left",
    sortable: false,
  },
];
