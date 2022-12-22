import * as yup from "yup";
import { GridColumns } from "@mui/x-data-grid";

import TableChipElement from "components/table-chip-element";

export const RoleFormSchema = yup.object({
  name: yup.string().min(2),
});

export const columns: GridColumns = [
  {
    field: "name",
    headerName: "Role",
    width: 280,
    headerClassName: "user-list-header",
    headerAlign: "left",
    sortable: false,
  },
  {
    field: "permissions",
    headerName: "Permissions",
    headerClassName: "user-list-header",
    renderCell: (params) => (
      <div className="permission-list">
        <TableChipElement
          rowItems={params}
          columnName="permissions"
          defaultSize={3}
        />
      </div>
    ),
    headerAlign: "left",
    sortable: false,
    flex: 0.7,
  },
];