import { Chip, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";

import "./styles.css";
interface TableChipElementProps {
  rowItems: any;
  columnName: string;
  defaultSize: number;
}

const TableChipElement: FC<TableChipElementProps> = ({
  rowItems,
  columnName,
  defaultSize,
}) => {
  const { row } = rowItems;
  const [viewMore, setViewMore] = useState("");

  useEffect(() => {
    let moreItems = "";
    row[columnName]?.slice(defaultSize, row.length).map((item: any) => {
      moreItems = moreItems.concat(", ", item?.label ?? item.name);
    });
    if (moreItems[0] === ",") {
      moreItems = moreItems.slice(2, moreItems.length);
    }
    setViewMore(moreItems);
  }, [row]);
  return (
    <>
      {row[columnName]?.map(
        (item: any, i: number) =>
          i < defaultSize && (
            <Chip
              label={item?.label ?? item?.name}
              key={item?.id}
              id={row.status !== "INVITED" ? "chip" : "blurred-chip"}
            />
          )
      )}
      {row[columnName]?.length > defaultSize && (
        <Tooltip title={viewMore} arrow placement="top">
          <Chip
            label={`+${row[columnName]?.length - defaultSize}`}
            key="click-to-see-more"
            id={row.status !== "INVITED" ? "count-chip" : "blurred-count-chip"}
          />
        </Tooltip>
      )}
    </>
  );
};
export default TableChipElement;
