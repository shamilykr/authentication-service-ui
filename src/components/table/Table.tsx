import { DataGrid } from "@mui/x-data-grid";
import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";
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
import CustomPagination from "components/custom-pagination";
import { getFinalColumns } from "utils/table";

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

  const setCurrentPage = useSetRecoilState(paginationAtom);
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
            columns={getFinalColumns(
              field,
              columns,
              deleteMutation,
              buttonLabel,
              isDeleteVerified,
              isEditVerified,
              onEdit,
              refetchQuery,
              fetchEntities
            )}
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
              Pagination: () => (
                <CustomPagination fetchEntities={fetchEntities} count={count} />
              ),
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
