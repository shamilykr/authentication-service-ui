import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { FC, useEffect, useState } from "react";
import { Avatar } from "@mui/material";

import { TableToolBarProps } from "./types";
import "./styles.css";
import SearchBar from "../search-bar/SearchBar";
import { ReactComponent as PlusIcon } from "assets/plus.svg";
import { ReactComponent as SortIcon } from "assets/sort.svg";
import { ReactComponent as FilterIcon } from "assets/filter.svg";
import { sortCountAtom } from "states/searchSortFilterStates";
import { useUsersFetch } from "hooks/usersFetch";
import FilterDropdown from "components/filter-dropdown";

const TableToolBar: FC<TableToolBarProps> = ({
  field,
  text,
  filterList,
  firstFilter,
  firstFilterName,
  setFirstFilter,
  secondFilter,
  secondFilterName,
  setSecondFilter,
  searchLabel,
  buttonLabel,
  setItemList,
  searchQuery,
  isAddVerified,
  onAdd,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [filter, setFilter] = useState(0);
  const [count, setCount] = useRecoilState(sortCountAtom);
  const onApply = (count: number) => {
    setFilter(count);
    setAnchorEl(null);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentFirstFilter(firstFilter as unknown as never[]);
    setCurrentSecondFilter(secondFilter as unknown as never[]);
  };
  const handleClose = () => {
    setAnchorEl(null);
    handleCancel();
  };

  const [currentFirstFilter, setCurrentFirstFilter] = useState([]);
  const [currentSecondFilter, setCurrentSecondFilter] = useState([]);

  const handleCancel = () => {
    if (
      typeof setSecondFilter !== "undefined" &&
      typeof setFirstFilter !== "undefined"
    ) {
      setFirstFilter(currentFirstFilter);
      setSecondFilter(currentSecondFilter);
    }
    handleClose();
  };

  const fetchUsers = useUsersFetch({
    userParams: { setList: setItemList, query: searchQuery, field: field },
  });
  useEffect(() => {
    fetchUsers();
  }, [count]);

  const onSort = () => {
    if (count === 2) setCount(1);
    else setCount(count + 1);
  };
  return (
    <div className="table-toolbar">
      <div className="search-sort-filter">
        <SearchBar
          searchLabel={searchLabel}
          setItemList={setItemList}
          searchQuery={searchQuery}
        />
        <div
          className={count > 0 ? "sort-button-enabled" : "sort-button"}
          onClick={onSort}
        >
          <SortIcon id={count > 0 ? "sort-icon-enabled" : "sort-filter-icon"} />
          Sort by Name
        </div>

        {field === "firstName" && (
          <div
            className={`filter${filter > 0 ? "-count" : "-button"}`}
            onClick={handleClick}
          >
            <FilterIcon id="sort-filter-icon" />
            Add Filter
            {filter > 0 && (
              <Avatar
                sx={{
                  ml: "10px !important",
                  backgroundColor: "#2653F1",
                  color: "white",
                  width: "20px !important",
                  height: "20px !important",
                  fontSize: "12px !important",
                }}
              >
                {filter}
              </Avatar>
            )}
          </div>
        )}
      </div>
      {!isAddVerified && (
        <div className="toolbar-button">
          <Button
            variant="contained"
            id="add-button"
            onClick={onAdd}
            sx={{ textTransform: "none" }}
          >
            <PlusIcon />
            {buttonLabel}
          </Button>
        </div>
      )}
      {filterList && (
        <FilterDropdown
          field={field}
          searchQuery={searchQuery}
          setItemList={setItemList}
          filterList={filterList}
          firstFilter={firstFilter}
          secondFilter={secondFilter}
          setFirstFilter={setFirstFilter}
          setSecondFilter={setSecondFilter}
          open={open}
          anchorEl={anchorEl}
          onApply={onApply}
          firstFilterName={firstFilterName as unknown as string}
          secondFilterName={secondFilterName as unknown as string}
          currentFilters={[currentFirstFilter, currentSecondFilter]}
        />
      )}
    </div>
  );
};
export default TableToolBar;
