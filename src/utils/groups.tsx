import * as yup from "yup";
import { GridColumns } from "@mui/x-data-grid";

import AvatarList from "components/avatar-list/AvatarList";
import TableChipElement from "components/table-chip-element";

export const columns: GridColumns = [
  {
    field: "name",
    headerName: "Group",
    headerClassName: "group-list-header",
    headerAlign: "left",
    width: 280,
    sortable: false,
  },
  {
    field: "roles",
    headerName: "Roles",
    headerClassName: "group-list-header",
    flex: 0.6,
    renderCell: (params) => (
      <div className="role-list">
        <TableChipElement
          rowItems={params}
          columnName="roles"
          defaultSize={3}
        />
      </div>
    ),
    headerAlign: "left",
    sortable: false,
  },
  {
    field: "users",
    headerName: "Members",
    headerClassName: "group-list-header",
    flex: 0.5,
    renderCell: (params) => (
      <div className="role-list">
        <AvatarList {...params} />
      </div>
    ),
    headerAlign: "left",
    sortable: false,
  },
];

export const GroupFormSchema = yup.object({
  name: yup.string().min(2, "Group name must have atleast two characters"),
});
