import { FC, useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";

import { ReactComponent as UnCheckedIcon } from "assets/checkbox-icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "assets/checkbox-icons/checkedicon.svg";
import CustomAvatar from "components/custom-avatar";
import SearchBar from "../search-bar/SearchBar";
import { ChecklistProps } from "./types";
import "./styles.css";
import { searchAtom } from "states/searchSortFilterStates";

export const AvatarChecklistComponent: FC<ChecklistProps> = ({
  mapList,
  currentCheckedItems,
  onChange,
  setItemList,
  searchQuery,
}) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const searchValue = useRecoilValue(searchAtom);

  const isTabletScreen = useMediaQuery({ query: "(max-width: 940px)" });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectAll(true);
    else setSelectAll(false);
    onChange(e);
  };

  useEffect(() => {
    if (
      mapList?.length === currentCheckedItems?.length &&
      mapList.length !== 0
    ) {
      setSelectAll(true);
    } else setSelectAll(false);
  }, [mapList, currentCheckedItems]);
  const getIsChecked = (item: any) => {
    //@ts-ignore
    return (
      currentCheckedItems?.findIndex((val: any) => val?.id === item?.id) !== -1
    );
  };

  return (
    <div className="user-checklist">
      <div className="titlebar">
        <SearchBar
          searchLabel={isTabletScreen ? "Search" : "Search Members"}
          setItemList={(response) => setItemList(response?.getUsers?.results)}
          searchQuery={searchQuery}
          customSearchStyle={{ width: "70%" }}
          customBarStyle={{ border: "1px solid #d2d5dd" }}
          customIconStyle={{ bottom: isTabletScreen ? "9px" : "7px" }}
        />
        {!searchValue && (
          <div className="selectall-avatar">
            <Checkbox
              value={"all"}
              onChange={handleSelectAll}
              checked={selectAll}
              icon={<UnCheckedIcon />}
              checkedIcon={<CheckedIcon />}
            />
            <div style={{ display: "flex", marginLeft: "5px" }}>
              {" "}
              Select All
            </div>
          </div>
        )}
      </div>
      <div className="component">
        {mapList?.map((item: any) => {
          return (
            <div className="avatar-wrapper" key={item?.id}>
              <div className="custom-checkbox-item">
                <Checkbox
                  value={item?.id}
                  onChange={(e) => onChange(e, item)}
                  checked={getIsChecked(item)}
                  icon={<UnCheckedIcon />}
                  checkedIcon={<CheckedIcon />}
                  key={item?.id}
                />
              </div>

              <CustomAvatar
                lastName={item?.lastName}
                firstName={item?.firstName}
                email={item?.email}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
