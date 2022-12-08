import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRecoilState } from "recoil";
import React, { FC, useState } from "react";

import { TableToolBarProps } from "./types";
import "./styles.css";
import SearchBar from "../search-bar/SearchBar";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as SortIcon } from "../../assets/sort.svg";
import { ReactComponent as FilterIcon } from "../../assets/filter.svg";
import { ReactComponent as LeftArrowIcon } from "../../assets/arrow-left.svg";
import { groupListAtom } from "../../states/groupStates";

const TableToolBar: FC<TableToolBarProps> = ({
  text,
  searchLabel,
  buttonLabel,
  setItemList,
  searchQuery,
  isAddVerified,
  onAdd,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewStatusFilter, setStatusFilter] = useState(true);
  const [viewGroupFilter, setGroupFilter] = useState(false);
  const open = Boolean(anchorEl);
  const statusList = ["Active", "Inactive", "Invited"];
  const [groupList] = useRecoilState(groupListAtom);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentCheckedStatus(checkedStatus);
    setCurrentCheckedGroups(checkedGroups);
  };
  const handleClose = () => {
    setAnchorEl(null);
    handleCancel();
  };
  const [checkedStatus, setCheckedStatus] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState([]);
  const [currentCheckedStatus, setCurrentCheckedStatus] = useState([]);
  const [currentCheckedGroups, setCurrentCheckedGroups] = useState([]);

  const switchFilter = (status: boolean, group: boolean) => {
    setStatusFilter(status);
    setGroupFilter(group);
  };

  const onAddFilter = (
    name: string,
    e: React.ChangeEvent<HTMLInputElement>,
    checkedItems: never[],
    setCheckedItems: React.Dispatch<React.SetStateAction<never[]>>
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setCheckedItems(checkedItems.concat(name as unknown as never[]));
    } else {
      setCheckedItems(checkedItems.filter((x) => x !== name));
    }
  };

  const handleCheckedItems = (item: string, checkedItems: never[]) => {
    if (checkedItems.includes(item as unknown as never)) return true;
    else return false;
  };

  const handleClearAll = () => {
    setCheckedGroups([]);
    setCheckedStatus([]);
  };

  const handleCancel = () => {
    setCheckedStatus(currentCheckedStatus);
    setCheckedGroups(currentCheckedGroups);
    handleClose();
  };

  const handleSave = () => {
    setAnchorEl(null);
  };

  return (
    <div className="table-toolbar">
      <div className="search-sort-filter">
        <SearchBar
          searchLabel={searchLabel}
          setItemList={setItemList}
          searchQuery={searchQuery}
        />
        <div className="sort-button">
          <SortIcon id="sort-filter-icon" />
          Sort by
        </div>

        <div className="filter-button" onClick={handleClick}>
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
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        sx={{ minHeight: "100%" }}
        PaperProps={{
          elevation: 0,
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="filter">
          <div
            className="filter-by"
            style={viewGroupFilter ? { width: "348px" } : { width: "318px" }}
          >
            <div style={{ position: "fixed" }}>
              <MenuItem
                id="heading-clear-all"
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                    cursor: "default",
                  },
                }}
              >
                <div id="filter-heading">Filters</div>
                <div id="clear-all" onClick={handleClearAll}>
                  Clear All
                </div>
              </MenuItem>
              <MenuItem
                id="filter-by-options"
                onClick={() => switchFilter(true, false)}
              >
                <div>Status</div>
                <div id="avatar-arrow">
                  <Avatar
                    sx={{
                      mr: "12px !important",
                      backgroundColor: "#2653F1",
                      color: "white",
                      width: "24px !important",
                      height: "24px !important",
                      fontSize: "14px !important",
                    }}
                  >
                    {checkedStatus.length}
                  </Avatar>
                  <LeftArrowIcon />
                </div>
              </MenuItem>
              <MenuItem
                id="filter-by-options"
                onClick={() => switchFilter(false, true)}
              >
                <div>Groups</div>
                <div id="avatar-arrow">
                  <Avatar
                    sx={{
                      mr: "12px !important",
                      backgroundColor: "#2653F1",
                      color: "white",
                      width: "24px !important",
                      height: "24px !important",
                      fontSize: "14px !important",
                    }}
                  >
                    {checkedGroups.length}
                  </Avatar>
                  <LeftArrowIcon />
                </div>
              </MenuItem>
            </div>
            <div style={{ position: "fixed", top: "382px" }}>
              <MenuItem>
                <Button
                  id="filter-button"
                  sx={{
                    color: "#2653F1",
                    border: "1px solid #2653F1",
                    mr: "8px",
                    "&:hover": {
                      border: "1px solid #2653F1",
                      color: "#2653F1",
                    },
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  id="filter-button"
                  sx={{
                    backgroundColor: "#2653F1",
                    color: "white",
                    ml: "8px",
                    "&:hover": {
                      backgroundColor: "#2653F1",
                      color: "white",
                    },
                  }}
                  onClick={handleSave}
                >
                  Apply
                </Button>
              </MenuItem>
            </div>
          </div>
          {viewStatusFilter && (
            <div className="options">
              <FormGroup>
                {statusList.map((status: string, index: number) => (
                  <FormControlLabel
                    key={`${index}_${status}`}
                    label={status}
                    name={status}
                    control={
                      <Checkbox
                        sx={{ color: "#7E818D" }}
                        onChange={(e) => {
                          onAddFilter(
                            status,
                            e,
                            checkedStatus,
                            setCheckedStatus
                          );
                        }}
                        defaultChecked={false}
                        checked={handleCheckedItems(status, checkedStatus)}
                        className={
                          handleCheckedItems(status, checkedStatus) === true
                            ? "checked"
                            : "unchecked"
                        }
                      />
                    }
                  />
                ))}
              </FormGroup>
            </div>
          )}
          {viewGroupFilter && (
            <div className="options">
              <FormGroup>
                {groupList.map((group: any) => (
                  <FormControlLabel
                    key={group?.id}
                    label={group.name}
                    name={group.name}
                    control={
                      <Checkbox
                        sx={{ color: "#7E818D" }}
                        onChange={(e) => {
                          onAddFilter(
                            group.name,
                            e,
                            checkedGroups,
                            setCheckedGroups
                          );
                        }}
                        checked={handleCheckedItems(group.name, checkedGroups)}
                        className={
                          handleCheckedItems(group.name, checkedGroups) === true
                            ? "checked"
                            : "unchecked"
                        }
                      />
                    }
                  />
                ))}
              </FormGroup>
            </div>
          )}
        </div>
      </Menu>
    </div>
  );
};
export default TableToolBar;
