import { FC, useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";

import { ReactComponent as UnCheckedIcon } from "assets/checkbox-icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "assets/checkbox-icons/checkedicon.svg";
import { Group } from "types/group";
import "./styles.css";
import GroupCard from "../group-card";

interface ChecklistProps {
  mapList: Group[];
  currentCheckedItems: Group[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, item?: any) => void;
}

export const ChecklistComponent: FC<ChecklistProps> = ({
  mapList,
  currentCheckedItems,
  onChange,
}) => {
  const { id } = useParams();
  const containerHeight = id ? "calc(100vh - 410px)" : "calc(100vh - 490px)";

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectAll(true);
    else setSelectAll(false);
    onChange(e);
  };

  useEffect(() => {
    if (mapList?.length === currentCheckedItems?.length) {
      setSelectAll(true);
    } else setSelectAll(false);
  }, [mapList, currentCheckedItems]);

  return (
    <div id="add-items-checklist" style={{ height: containerHeight }}>
      <div id="titlebar">
        <div id="selectall">
          <Checkbox
            value={"all"}
            onChange={handleSelectAll}
            checked={selectAll}
            icon={<UnCheckedIcon />}
            checkedIcon={<CheckedIcon />}
            sx={{ mr: "5px" }}
          />
          <span> Select all</span>
        </div>
      </div>
      <div className="group-cards-container">
        {mapList?.map((item: any) => {
          return (
            <GroupCard
              group={item}
              currentCheckedItems={currentCheckedItems}
              onChange={onChange}
              key={item?.id}
            />
          );
        })}
      </div>
    </div>
  );
};
