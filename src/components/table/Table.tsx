import { DataGrid, GridColumns } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FC, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useSetRecoilState, useRecoilState } from "recoil";

import { UserPermissionsAtom } from "states/permissionsStates";
import { TableProps } from "./types";
import TableToolBar from "../table-toolbar/TableToolBar";
import "./styles.css";
import DisplayMessage from "../display-message";
import {
  statusFilterAtom,
  groupFilterAtom,
  sortCountAtom,
  searchAtom,
  paginationAtom,
} from "states/searchSortFilterStates";
import { useFetchEntities } from "hooks/useFetchEntities";
import {
  ACCESS_DENIED_DESCRIPTION,
  ACCESS_DENIED_MESSAGE,
} from "constants/messages";
import ActionsCell from "components/actions-cell";

const TableList: FC<TableProps> = ({
  field,
  rows,
  columns,
  count,
  filterList,
  firstFilter,
  filterName,
  setFirstFilter,
  secondFilter,
  setSecondFilter,
  isViewFilterVerified,
  setItemList,
  onAdd,
  onEdit,
  buttonLabel,
  searchLabel,
  deleteMutation,
  refetchQuery,
  editPermission,
  deletePermission,
  isViewVerified,
  isAddVerified,
  handleRowClick,
}) => {
  const [isEditVerified, setEditVerified] = useState(false);
  const [isDeleteVerified, setDeleteVerified] = useState(false);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const setCheckedStatus = useSetRecoilState(statusFilterAtom);
  const setCheckedGroups = useSetRecoilState(groupFilterAtom);
  const setCount = useSetRecoilState(sortCountAtom);
  const setSearchValue = useSetRecoilState(searchAtom);

  const [currentPage, setCurrentPage] = useRecoilState(paginationAtom);
  const fetchEntities = useFetchEntities({
    userParams: { setList: setItemList, query: refetchQuery, field: field },
  });
  useEffect(() => {
    if (userPermissions)
      userPermissions.forEach((item: any) => {
        if (item?.name.includes(editPermission)) {
          setEditVerified(true);
        }
        if (item?.name.includes(deletePermission)) {
          setDeleteVerified(true);
        }
      });
  }, [editPermission, deletePermission, userPermissions]);

  useEffect(() => {
    return () => {
      setCheckedGroups([]);
      setCheckedStatus([]);
      setCurrentPage(1);
      setCount(0);
      setSearchValue("");
    }; // eslint-disable-next-line
  }, []);

  function CustomPagination() {
    const [pageValue, setPageValue] = useState(1);
    return (
      <>
        <div className="pagination-count">
          Total {`${count}`} item{count > 1 && `s`}
        </div>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          page={currentPage}
          count={
            count % 8 > 0 ? Math.floor(count / 8) + 1 : Math.floor(count / 8)
          }
          // @ts-expect-error
          renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
          onChange={(event, value) => {
            setPageValue(value);
            setCurrentPage(value);
            fetchEntities({ page: value - 1 });
          }}
        />
        <div className="go-to-page">
          <div id="pagination-text">Go to Page</div>
          <div>
            <TextField
              value={pageValue}
              onChange={(e: any) => {
                setPageValue(e.target.value);
              }}
              inputProps={{
                min: 0,
                style: { textAlign: "center", padding: 0 },
              }}
              sx={{ ml: "9px", mr: "9px" }}
            />
          </div>
          <div>
            <Button
              id="go-button"
              onClick={() => {
                setCurrentPage(pageValue);
                setPageValue(pageValue);
                fetchEntities({ page: pageValue - 1 });
              }}
            >
              Go
            </Button>
          </div>
        </div>
      </>
    );
  }

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
            />
          </>,
        ];
      },
    },
  ];
  let final_columns;
  if (!isEditVerified && !isDeleteVerified) final_columns = columns;
  else final_columns = [...columns, ...action_column];

  return (
    <div className="table-component">
      {isViewVerified ? (
        <>
          <TableToolBar
            buttonLabel={buttonLabel}
            searchLabel={searchLabel}
            setItemList={setItemList}
            searchQuery={refetchQuery}
            isAddVerified={isAddVerified}
            onAdd={onAdd}
            field={field}
            filterList={filterList}
            firstFilter={firstFilter}
            secondFilter={secondFilter}
            setFirstFilter={setFirstFilter}
            setSecondFilter={setSecondFilter}
            filterName={filterName}
            isViewFilterVerified={isViewFilterVerified}
          />
          <DataGrid
            rows={rows}
            columns={final_columns}
            style={{
              borderRadius: "0px 0px 5px 5px",
              cursor: field === "name" ? "default" : "pointer",
            }}
            disableSelectionOnClick
            onRowClick={handleRowClick}
            disableColumnMenu
            pageSize={8}
            rowsPerPageOptions={[5]}
            components={{
              Pagination: CustomPagination,
            }}
          />
        </>
      ) : (
        <DisplayMessage
          altMessage={ACCESS_DENIED_MESSAGE}
          image="./assets/access-denied.png"
          heading={ACCESS_DENIED_MESSAGE}
          description={ACCESS_DENIED_DESCRIPTION}
        />
      )}
    </div>
  );
};
export default TableList;
