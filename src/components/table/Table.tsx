import { DataGrid, GridColumns } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FC, useEffect, useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useMediaQuery } from "react-responsive";

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
import If from "components/if";

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

  const isPortrait = useMediaQuery({ orientation: "portrait" });

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
    const [pageCount] = useState(
      count % 15 > 0 ? Math.floor(count / 15) + 1 : Math.floor(count / 15)
    );
    const onClickGo = () => {
      if (!isNaN(pageValue)) {
        if (pageValue > pageCount) setCurrentPage(pageCount);
        else if (pageValue < 1) setCurrentPage(1);
        else setCurrentPage(Number(pageValue));
        fetchEntities({
          page:
            pageValue > pageCount
              ? pageCount - 1
              : pageValue < 1
              ? 0
              : pageValue - 1,
        });
      }
    };
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
          count={pageCount}
          // @ts-expect-error
          renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
          onChange={(event, value) => {
            setPageValue(value);
            setCurrentPage(value);
            fetchEntities({ page: value - 1 });
          }}
        />
        <div className="go-to-page">
          <If condition={count > 15}>
            <div id="pagination-text">Go to Page</div>
            <div>
              <TextField
                type="number"
                defaultValue={currentPage}
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
              <Button id="go-button" onClick={onClickGo}>
                Go
              </Button>
            </div>
          </If>
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
            columnVisibilityModel={{
              groups: isPortrait ? false : true,
            }}
            rows={rows}
            columns={final_columns}
            style={{
              borderRadius: "0px 0px 5px 5px",
              cursor: field === "name" ? "default" : "pointer",
            }}
            disableSelectionOnClick
            onRowClick={handleRowClick}
            disableColumnMenu
            pageSize={15}
            rowsPerPageOptions={[5]}
            components={{
              Pagination: CustomPagination,
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No {buttonLabel.slice(3, buttonLabel.length).toLowerCase()}s
                  to show
                </Stack>
              ),
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
