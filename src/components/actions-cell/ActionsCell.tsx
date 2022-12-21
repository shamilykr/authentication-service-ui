import { FC, useState } from "react";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { useSetRecoilState } from "recoil";

import { ReactComponent as EditIcon } from "assets/table-actions-icons/edit.svg";
import { ReactComponent as LineIcon } from "assets/table-actions-icons/line.svg";
import { ReactComponent as DeleteIcon } from "assets/table-actions-icons/trash.svg";
import DialogBox from "../dialog-box";
import { ActionsCellProps } from "./types";
import { apiRequestAtom, toastMessageAtom } from "states/apiRequestState";
import { useCustomMutation } from "hooks/useMutation";

const ActionsCell: FC<ActionsCellProps> = ({
  isEditVerified,
  isDeleteVerified,
  onEdit,
  entity,
  deleteMutation,
  refetchQuery,
  params,
}) => {
  const [open, setOpen] = useState(false);
  const [entityId, setEntityId] = useState<GridRowId>("");
  const [entityName, setEntityName] = useState<string>("");
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  const openConfirmPopup = (id: GridRowId, name: string) => {
    setOpen(true);
    setEntityId(id);
    setEntityName(name);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteCompleted = () => {
    setToastMessage(`${entity} deleted successfully`);
    setApiSuccess(true);
  };
  const [deleteItem] = useCustomMutation(deleteMutation, onDeleteCompleted, [
    { query: refetchQuery },
  ]);

  const onConfirmDelete = () => {
    deleteItem({
      variables: {
        id: entityId,
      },
    });
    handleClose();
  };
  return (
    <>
      {isEditVerified && (
        <Tooltip title="Edit" arrow placement="top">
          <GridActionsCellItem
            icon={
              <>
                <EditIcon
                  className={
                    params.row.status !== "INVITED" ? "edit" : "blurred-edit"
                  }
                />
                <LineIcon
                  className={
                    params.row.status !== "INVITED"
                      ? "edit-line"
                      : "blurred-edit-line"
                  }
                />
              </>
            }
            label="Edit"
            className="edit"
            onClick={() => onEdit(params.id)}
          />
        </Tooltip>
      )}
      {isDeleteVerified && (
        <Tooltip title="Delete" arrow placement="top">
          <GridActionsCellItem
            icon={<DeleteIcon className="delete" />}
            label="Delete"
            className={
              params.row.status !== "INVITED" ? "delete" : "blurred-delete"
            }
            onClick={() => {
              openConfirmPopup(
                params.id,
                params.row.name
                  ? params.row.name
                  : `${params.row.firstName} ${params.row.lastName}`
              );
            }}
          />
        </Tooltip>
      )}
      {open && (
        <DialogBox
          deleteMutation={deleteMutation}
          refetchQuery={refetchQuery}
          entity={entity}
          entityId={entityId}
          entityName={entityName}
          onConfirm={onConfirmDelete}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default ActionsCell;
