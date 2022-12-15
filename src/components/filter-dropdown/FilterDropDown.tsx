import { FC, useState } from "react";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SetterOrUpdater } from "recoil";
import { Avatar } from "@mui/material";

import "./styles.css";
import Filter from "components/filter/Filter";
import { ReactComponent as LeftArrowIcon } from "assets/arrow-left.svg";
import { useUsersFetch } from "hooks/usersFetch";
import { DocumentNode } from "graphql";

interface FilterDropdownProps {
  firstFilter?: never[];
  setFirstFilter?: SetterOrUpdater<never[]>;
  secondFilter?: never[];
  setSecondFilter?: SetterOrUpdater<never[]>;
  searchQuery: DocumentNode;
  setItemList: any;
  field: string;
  filterList?: any;
  open: boolean;
  anchorEl: any;
  onApply: (count: number) => void;
  firstFilterName: string;
  secondFilterName: string;
  currentFilters: any;
}

const FilterDropdown: FC<FilterDropdownProps> = ({
  firstFilter,
  setFirstFilter,
  secondFilter,
  setSecondFilter,
  searchQuery,
  setItemList,
  field,
  filterList,
  open,
  anchorEl,
  onApply,
  firstFilterName,
  secondFilterName,
  currentFilters,
}) => {
  const [viewFirstFilter, setViewFirstFilter] = useState(true);
  const [viewSecondFilter, setViewSecondFilter] = useState(false);
  const handleClose = () => {
    let totalLength = 0;
    currentFilters.map((item: never[]) => {
      totalLength = totalLength + item.length;
    });
    onApply(totalLength);
    handleCancel();
  };
  const switchFilter = (first: boolean, second: boolean) => {
    setViewFirstFilter(first);
    setViewSecondFilter(second);
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
    if (
      typeof setSecondFilter !== "undefined" &&
      typeof setFirstFilter !== "undefined"
    ) {
      setSecondFilter([]);
      setFirstFilter([]);
    }
  };

  const handleCancel = () => {
    if (
      typeof setSecondFilter !== "undefined" &&
      typeof setFirstFilter !== "undefined"
    ) {
      setFirstFilter(currentFilters[0]);
      setSecondFilter(currentFilters[1]);
    }
    handleClose();
  };
  const fetchUsers = useUsersFetch({
    userParams: { setList: setItemList, query: searchQuery, field: field },
  });

  const handleSave = () => {
    onApply(
      (firstFilter as unknown as never[]).length +
        (secondFilter as unknown as never[]).length
    );
    fetchUsers();
  };
  return (
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
          style={viewSecondFilter ? { width: "348px" } : { width: "318px" }}
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
              <Avatar
                sx={{
                  ml: "10px !important",
                  backgroundColor: "#2653F1",
                  color: "white",
                  width: "24px !important",
                  height: "24px !important",
                  fontSize: "14px !important",
                  mr: "112px",
                }}
              >
                {(firstFilter as unknown as never[]).length +
                  (secondFilter as unknown as never[]).length}
              </Avatar>
              <div id="clear-all" onClick={handleClearAll}>
                Clear All
              </div>
            </MenuItem>
            <MenuItem
              id="filter-by-options"
              onClick={() => switchFilter(true, false)}
            >
              <div>{firstFilterName}</div>
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
                  {(firstFilter as unknown as never[]).length}
                </Avatar>
                <LeftArrowIcon />
              </div>
            </MenuItem>
            <MenuItem
              id="filter-by-options"
              onClick={() => switchFilter(false, true)}
            >
              <div>{secondFilterName}</div>
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
                  {(secondFilter as unknown as never[]).length}
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
        {viewFirstFilter && (
          <Filter
            itemList={filterList[0]}
            checkedItems={firstFilter as unknown as never[]}
            handleCheckedItems={handleCheckedItems}
            setCheckedItems={
              setFirstFilter as unknown as SetterOrUpdater<never[]>
            }
            onAddFilter={onAddFilter}
          />
        )}
        {viewSecondFilter && (
          <Filter
            itemList={filterList[1]}
            checkedItems={secondFilter as unknown as never[]}
            handleCheckedItems={handleCheckedItems}
            setCheckedItems={
              setSecondFilter as unknown as SetterOrUpdater<never[]>
            }
            onAddFilter={onAddFilter}
          />
        )}
      </div>
    </Menu>
  );
};

export default FilterDropdown;
