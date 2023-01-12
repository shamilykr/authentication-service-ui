import { FC, useState } from "react";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SetterOrUpdater } from "recoil";
import { Avatar } from "@mui/material";
import { useMediaQuery } from "react-responsive";

import Filter from "components/filter/Filter";
import { ReactComponent as LeftArrowIcon } from "assets/toolbar-icons/arrow-left.svg";
import { useFetchEntities } from "hooks/useFetchEntities";
import { statusList } from "constants/filters";
import "./styles.css";
import { FilterDropdownProps } from "./types";

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
  filterName,
  currentFilters,
  isViewFilterVerified,
}) => {
  const [viewFirstFilter, setViewFirstFilter] = useState(true);
  const [viewSecondFilter, setViewSecondFilter] = useState(false);
  const isPortrait = useMediaQuery({ orientation: "portrait" });

  const handleClose = () => {
    let totalLength = 0; // eslint-disable-next-line
    currentFilters.map((item: never[]) => {
      totalLength = totalLength + item.length;
    });
    onApply(totalLength);
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
  const fetchEntities = useFetchEntities({
    userParams: { setList: setItemList, query: searchQuery, field: field },
  });

  const handleSave = () => {
    onApply(
      (firstFilter as unknown as never[]).length +
        (secondFilter as unknown as never[]).length
    );
    fetchEntities({});
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
        sx: {
          "&:before": {
            visibility: isPortrait ? "hidden" : "visible",
          },
        },
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
                id="filter-avatar"
                sx={{
                  ml: "10px !important",
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
              <div>{filterName[0]}</div>
              <div id="avatar-arrow">
                <Avatar
                  id="filter-avatar"
                  sx={{
                    mr: "12px !important",
                  }}
                >
                  {(firstFilter as unknown as never[]).length}
                </Avatar>
                <LeftArrowIcon />
              </div>
            </MenuItem>
            {isViewFilterVerified && (
              <MenuItem
                id="filter-by-options"
                onClick={() => switchFilter(false, true)}
              >
                <div>{filterName[1]}</div>
                <div id="avatar-arrow">
                  <Avatar
                    id="filter-avatar"
                    sx={{
                      mr: "12px !important",
                    }}
                  >
                    {(secondFilter as unknown as never[]).length}
                  </Avatar>
                  <LeftArrowIcon />
                </div>
              </MenuItem>
            )}
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
            itemList={statusList}
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
            itemList={filterList as unknown as never[]}
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
