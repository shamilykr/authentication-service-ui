import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { FC, useState } from "react";
import { Avatar } from "@mui/material";
import { useMediaQuery } from "react-responsive";

import { ReactComponent as PlusIcon } from "assets/button-icons/plus.svg";
import { ReactComponent as SortIcon } from "assets/toolbar-icons/sort.svg";
import { ReactComponent as FilterIcon } from "assets/toolbar-icons/filter.svg";
import { sortCountAtom } from "states/searchSortFilterStates";
import { useFetchEntities } from "hooks/useFetchEntities";
import FilterDropdown from "components/filter-dropdown";
import { ADD_FILTER, SORT_BY_NAME } from "constants/messages";
import { TableToolBarProps } from "./types";
import "./styles.css";
import SearchBar from "../search-bar/SearchBar";

const TableToolBar: FC<TableToolBarProps> = ({
  field,
  filterList,
  firstFilter,
  filterName,
  setFirstFilter,
  secondFilter,
  setSecondFilter,
  searchLabel,
  buttonLabel,
  setItemList,
  searchQuery,
  isAddVerified,
  isViewFilterVerified,
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
  const isPortrait = useMediaQuery({ query: "(max-width: 980px)" });

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

  const fetchEntities = useFetchEntities({
    userParams: { setList: setItemList, query: searchQuery, field: field },
  });

  const onSort = () => {
    const countValue = count === 2 ? 1 : 2;
    setCount(countValue);
    fetchEntities({ countValue: countValue });
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
          {!isPortrait && SORT_BY_NAME}
        </div>

        {field === "firstName" && (
          <div
            className={`filter${filter > 0 ? "-count" : "-button"}`}
            onClick={handleClick}
          >
            <FilterIcon id="sort-filter-icon" />
            {!isPortrait && ADD_FILTER}
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
          filterName={filterName as unknown as string[]}
          currentFilters={[currentFirstFilter, currentSecondFilter]}
          isViewFilterVerified={isViewFilterVerified}
        />
      )}
    </div>
  );
};
export default TableToolBar;
