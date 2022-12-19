import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowId,
} from "@mui/x-data-grid";
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import React, { FC, useEffect, useState } from "react";
import { Tooltip, Button, TextField } from "@mui/material";
import { useSetRecoilState, useRecoilState } from "recoil";

import { UserPermissionsAtom } from "states/permissionsStates";
import { TableProps } from "./types";
import TableToolBar from "../table-toolbar/TableToolBar";
import "./styles.css";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import DisplayMessage from "../display-message";
import { ReactComponent as EditIcon } from "assets/edit.svg";
import { ReactComponent as LineIcon } from "assets/line.svg";
import { ReactComponent as DeleteIcon } from "assets/trash.svg";
import DialogBox from "../dialog-box";
import { useCustomMutation } from "hooks/useMutation";
import {
  statusFilterAtom,
  groupFilterAtom,
  sortCountAtom,
  searchAtom,
  paginationAtom,
} from "states/searchSortFilterStates";
import { useFetchEntities } from "hooks/useFetchEntities";
const TableList: FC<TableProps> = ({
  field,
  rows,
  columns,
  text,
  count,
  actionFlex,
  cursorType,
  filterList,
  firstFilter,
  firstFilterName,
  setFirstFilter,
  secondFilter,
  secondFilterName,
  setSecondFilter,
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
  entity,
}) => {
  const [isEditVerified, setEditVerified] = React.useState(false);
  const [isDeleteVerified, setDeleteVerified] = React.useState(false);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const [userPermissions] = useRecoilState(UserPermissionsAtom);
  const setCheckedStatus = useSetRecoilState(statusFilterAtom);
  const setCheckedGroups = useSetRecoilState(groupFilterAtom);
  const setCount = useSetRecoilState(sortCountAtom);
  // const [currentPage, setCurrentPage] = useState(1);
  const setSearchValue = useSetRecoilState(searchAtom);

  const [currentPage, setCurrentPage] = useRecoilState(paginationAtom);
  const [open, setOpen] = useState(false);
  const [entityId, setEntityId] = useState<GridRowId>("");
  const [entityName, setEntityName] = useState<string>("");
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

  const openConfirmPopup = (id: GridRowId, name: string) => {
    setOpen(true);
    setEntityId(id);
    setEntityName(name);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteCompleted = () => {
    setToastMessage(`${entity} deleted successfully`);
    setApiSuccess(true);
  };

  const [deleteItem] = useCustomMutation(deleteMutation, onDeleteCompleted, [
    { query: refetchQuery },
  ]);

  const onConfirmDelete = () => {
    deleteItem({
      variables: {
        id: entityId,
      },
    });
    handleClose();
  };

  useEffect(() => {
    return () => {
      setCheckedGroups([]);
      setCheckedStatus([]);
      setCurrentPage(1);
      setCount(0);
      setSearchValue("");
    };
  }, []);

  function CustomPagination() {
    // const apiRef = useGridApiContext();
    // // const page = useGridSelector(apiRef, gridPageSelector);
    // // const pageCount = useGridSelector(apiRef, gridPageCountSelector);
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
            console.log("value", value);
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
              sx={{
                textTransform: "none",
                backgroundColor: "#2F6FED",
                color: "white",
                minWidth: "32px !important",
                height: "35px !important",
              }}
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
      flex: actionFlex,
      cellClassName: "actions",
      headerAlign: "center",

      getActions: (params) => {
        return [
          <>
            {isEditVerified && (
              <Tooltip title="Edit" arrow placement="top">
                <GridActionsCellItem
                  icon={
                    <>
                      <EditIcon
                        className={
                          params.row.status !== "INVITED"
                            ? "edit"
                            : "blurred-edit"
                        }
                      />
                      <LineIcon
                        className={
                          params.row.status !== "INVITED"
                            ? "edit-line"
                            : "blurred-edit-line"
                        }
                      />
                    </>
                  }
                  label="Edit"
                  className="edit"
                  onClick={() => onEdit(params.id)}
                />
              </Tooltip>
            )}
            {isDeleteVerified && (
              <Tooltip title="Delete" arrow placement="top">
                <GridActionsCellItem
                  icon={<DeleteIcon className="delete" />}
                  label="Delete"
                  className={
                    params.row.status !== "INVITED"
                      ? "delete"
                      : "blurred-delete"
                  }
                  onClick={() => {
                    openConfirmPopup(
                      params.id,
                      params.row.name
                        ? params.row.name
                        : `${params.row.firstName} ${params.row.lastName}`
                    );
                  }}
                />
              </Tooltip>
            )}
            {open && (
              <DialogBox
                deleteMutation={deleteMutation}
                refetchQuery={refetchQuery}
                entity={entity}
                entityId={entityId}
                entityName={entityName}
                onConfirm={onConfirmDelete}
                handleClose={handleClose}
              />
            )}
          </>,
        ];
      },
    },
  ];
  let final_columns;
  if (!isEditVerified && !isDeleteVerified) {
    final_columns = columns;
  } else {
    final_columns = [...columns, ...action_column];
  }

  return (
    <div className="table-component">
      {isViewVerified ? (
        <>
          <TableToolBar
            text={text}
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
            firstFilterName={firstFilterName}
            secondFilterName={secondFilterName}
          />
          <DataGrid
            rows={rows}
            columns={final_columns}
            style={{
              borderRadius: "0px 0px 5px 5px",
              cursor: cursorType,
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
          altMessage="Access Denied"
          image="./assets/access-denied.png"
          heading="Access Denied"
          description="Sorry, you are not allowed to view this page."
        />
      )}
    </div>
  );
};
export default TableList;
