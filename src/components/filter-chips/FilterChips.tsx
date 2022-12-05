import { ApolloError, useQuery } from "@apollo/client";
import { Chip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

import "./styles.css";
import { GET_PERMISSIONS } from "../../containers/permissions/services/queries";
import { Permission } from "../../types/user";
import { apiRequestAtom, toastMessageAtom } from "../../states/apiRequestState";
import { RemovedPermissions } from "../../containers/permissions/constants";

interface FilterChipsProps {
  selectedPermissions: Permission[];
  handleClick: (permission: Permission) => void;
}

const FilterChips: React.FC<FilterChipsProps> = (props: FilterChipsProps) => {
  const { handleClick, selectedPermissions } = props;
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const setApiSuccess = useSetRecoilState(apiRequestAtom);
  const setToastMessage = useSetRecoilState(toastMessageAtom);
  useQuery(GET_PERMISSIONS, {
    onCompleted: (data) => {
      setAllPermissions(data?.getPermissions);
    },
    onError: (error: ApolloError) => {
      setToastMessage(error.message);
      setApiSuccess(false);
    },
  });

  return (
    <div className="chips-stack">
      {allPermissions?.map((permission: Permission) => {
        const selected = selectedPermissions.some(
          (selected: Permission) => selected.id === permission.id
        );
        const isValidPermission = !RemovedPermissions.includes(permission.name);

        return (
          <>
            {isValidPermission && (
              <Chip
                sx={
                  selected
                    ? {
                        fontSize: "medium",
                        borderWidth: "2px",
                        borderColor: "#01579B",
                      }
                    : {
                        fontSize: "medium",
                        color: "#454545",
                        background: "#fff",
                      }
                }
                key={permission.id}
                label={permission.name}
                onClick={() => handleClick(permission)}
                variant="outlined"
                icon={
                  selected ? <DoneIcon style={{ color: "green" }} /> : <> </>
                }
              />
            )}
          </>
        );
      })}
    </div>
  );
};

export default FilterChips;
