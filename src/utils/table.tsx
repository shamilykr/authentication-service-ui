import { GridColumns, GridRowId } from "@mui/x-data-grid";
import ActionsCell from "components/actions-cell";

import { DocumentNode } from "graphql";

export function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 10)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name), //#039be5bf
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0] || ""}`,
  };
}
export function stringSmallAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name), //#039be5bf
      width: "32px",
      height: "32px",
      fontSize: "15px",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0] || ""}`,
  };
}

export interface ApiParams {
  searchText?: any;
  countValue?: number;
  page?: any;
}

export function getFinalColumns(
  field: string,
  columns: GridColumns,
  deleteMutation: DocumentNode,
  buttonLabel: string,
  isDeleteVerified: boolean,
  isEditVerified: boolean,
  onEdit: (id: GridRowId) => void,
  refetchQuery: DocumentNode,
  fetchEntities: ({ searchText, countValue, page }: ApiParams) => void
): GridColumns {
  const action_column: GridColumns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      headerClassName: "table-list-header",
      flex: field === "name" ? 0.3 : 0.23,
      cellClassName: "actions",
      headerAlign: "center",

      getActions: (params) => {
        return [
          <>
            <ActionsCell
              deleteMutation={deleteMutation}
              entity={buttonLabel.slice(4, buttonLabel.length)}
              isDeleteVerified={isDeleteVerified}
              isEditVerified={isEditVerified}
              onEdit={onEdit}
              refetchQuery={refetchQuery}
              params={params}
              fetchEntities={fetchEntities}
            />
          </>,
        ];
      },
    },
  ];
  let final_columns;
  if (!isEditVerified && !isDeleteVerified) final_columns = columns;
  else final_columns = [...columns, ...action_column];
  return final_columns;
}
