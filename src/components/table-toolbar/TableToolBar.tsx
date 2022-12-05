import { Button } from "@mui/material";
import React, { FC } from "react";

import { TableToolBarProps } from "./types";
import "./styles.css";
import SearchBar from "../search-bar/SearchBar";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as SortIcon } from "../../assets/sort.svg";
import { ReactComponent as FilterIcon } from "../../assets/filter.svg";

const TableToolBar: FC<TableToolBarProps> = ({
  text,
  searchLabel,
  buttonLabel,
  setItemList,
  searchQuery,
  isAddVerified,
  onAdd,
}) => {
  return (
    <div className="table-toolbar">
      <div className="search-sort-filter">
        <SearchBar
          searchLabel={searchLabel}
          setItemList={setItemList}
          searchQuery={searchQuery}
        />
        <div className="sort-filter">
          <SortIcon id="sort-filter-icon" />
          Sort by
        </div>
        <div className="sort-filter">
          <FilterIcon id="sort-filter-icon" />
          Add Filter
        </div>
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
    </div>
  );
};
export default TableToolBar;
