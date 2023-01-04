import { Chip, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import CustomChip from "components/custom-chip";
import CustomDialog from "components/custom-dialog";
import If from "components/if";
import "./styles.css";
import { DialogContent } from "components/group-card/GroupCard";
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
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isTabletScreen = useMediaQuery({ query: "(max-height: 820px)" });
  const isPortrait = useMediaQuery({ orientation: "portrait" });

  if (isTabletScreen || isPortrait) {
    defaultSize = 2;
  }
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
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              if (isPortrait || isTabletScreen) setOpenModal(true);
            }}
          />
        </Tooltip>
      )}
      <If condition={openModal}>
        <CustomDialog
          title="Permissions"
          handleClose={() => setOpenModal(false)}
        >
          <DialogContent>
            {row[columnName]?.map((item: any) => (
              <CustomChip name={item.label ?? item.name} key={item?.id} />
            ))}
          </DialogContent>
        </CustomDialog>
      </If>
    </>
  );
};
export default TableChipElement;
