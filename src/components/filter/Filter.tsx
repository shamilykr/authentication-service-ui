import { FC } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import "./styles.css";
import { FilterProps } from "./types";

const Filter: FC<FilterProps> = ({
  itemList,
  onAddFilter,
  checkedItems,
  setCheckedItems,
  handleCheckedItems,
}) => {
  return (
    <div className="filter-options">
      <FormGroup>
        {itemList.map((item: string | any, index: number) => (
          <FormControlLabel
            key={`${index}_${item}`}
            label={
              typeof item === "string"
                ? item[0].concat(item.slice(1, item.length).toLowerCase())
                : item.name
            }
            name={typeof item === "string" ? item : item.name}
            control={
              <Checkbox
                sx={{ color: "#7E818D" }}
                onChange={(e) => {
                  onAddFilter(
                    typeof item === "string" ? item : item.id,
                    e,
                    checkedItems,
                    setCheckedItems
                  );
                }}
                checked={handleCheckedItems(
                  typeof item === "string" ? item : item.id,
                  checkedItems
                )}
                className={
                  handleCheckedItems(
                    typeof item === "string" ? item : item.id,
                    checkedItems
                  )
                    ? "filter-item-checked"
                    : "unchecked"
                }
              />
            }
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default Filter;
