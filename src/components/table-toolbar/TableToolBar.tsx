import { Button } from "@mui/material";
import React, { FC } from "react";

import { TableToolBarProps } from "./types";
import "./styles.css";
import SearchBar from "../search-bar/SearchBar";

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
      <legend className="legend-title">{text}</legend>
      <div className={!isAddVerified ? "search-button" : "only-search"}>
        <div className="search">
          <SearchBar
            searchLabel={searchLabel}
            setItemList={setItemList}
            searchQuery={searchQuery}
          />
        </div>
        {!isAddVerified && (
          <div className="toolbar-button">
            <Button variant="contained" id="add-button" onClick={onAdd}>
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default TableToolBar;
