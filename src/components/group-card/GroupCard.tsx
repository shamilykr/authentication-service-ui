import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import { FC, useState } from "react";

import { Role } from "types/role";
import RoleCard from "../role-card/RoleCard";
import { ReactComponent as DownArrowIcon } from "assets/icons/Stroke 1.svg";
import { getUniquePermissionsFromRoles } from "utils/permissions";
import { ReactComponent as UnCheckedIcon } from "assets/icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "assets/icons/checkedicon.svg";
import If from "../If/If";
import CustomDialog from "components/CustomDialog";
import "../checklist/styles.css";
import { Group } from "types/group";
import CustomChip from "../custom-chip/CustomChip";
interface GroupCardProps {
  group: any;
  currentCheckedItems?: Group[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, item?: any) => void;
  showCheckBox?: Boolean;
  isViewPage?: Boolean;
}
interface TabProps {
  checked?: boolean;
}

const Container = styled.div`
  font-family: "Manrope";
`;

const CheckBoxComponent = styled.div<{ roles: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d2d5dd;
  box-sizing: border-box;
  border-radius: ${(props) =>
    props.roles === "true" ? "6px 6px 0px 0px" : "6px"};
  padding: 24px;
  width: 100%;
  height: 76px;
`;

const RolesPermissionsTab = styled.div<TabProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 12px;
  height: 28px;
  background: ${(props) => (props.checked ? "#eaf1fd" : "#F1F2F5")};
  color: ${(props) => (props.checked ? "#2F6FED" : "#3E5468")};
  border-radius: 4px;
  font-family: "Manrope";
`;

const StyledDownArrowIcon = styled(DownArrowIcon)<{ roles: string }>`
  transform: ${(props) => (props.roles === "true" ? "rotate(180deg)" : "")};
  cursor: pointer;
`;

const RoleCards = styled.div<{ roles: string }>`
  display: ${(props) => (props.roles === "true" ? "flex" : "none")};
  flex-direction: column;
  padding: 0px 24px 24px 24px;
  border: 1px solid #d2d5dd;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: none;
`;

const DialogContent = styled.div`
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 0px 20px 30px 20px;
`;
const GroupCard: FC<GroupCardProps> = ({
  group,
  currentCheckedItems,
  onChange,
  showCheckBox = true,
  isViewPage = false,
}) => {
  const [showRoles, setShowRoles] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isChecked = (id: string) => {
    return Boolean(
      currentCheckedItems?.some((item) => item.id === id) || isViewPage
    );
  };
  return (
    <>
      <Container>
        <CheckBoxComponent key={group.id} roles={showRoles.toString()}>
          <div className="checkbox-label">
            {showCheckBox && (
              <Checkbox
                key={group.id}
                checked={isChecked(group.id)}
                onChange={(e) => onChange && onChange(e, group)}
                className="custom-checkbox"
                icon={<UnCheckedIcon />}
                checkedIcon={<CheckedIcon />}
              />
            )}
            <span className="checklistLabel">{group?.name}</span>
          </div>
          <div className="roles-permissions-dropdown">
            <RolesPermissionsTab checked={isChecked(group.id)}>
              {`${group?.roles?.length} Roles & ${
                getUniquePermissionsFromRoles(group?.roles).length
              } Permissions`}
            </RolesPermissionsTab>
            <StyledDownArrowIcon
              onClick={() => setShowRoles(!showRoles)}
              roles={showRoles.toString()}
            />
          </div>
        </CheckBoxComponent>
        <RoleCards roles={showRoles.toString()}>
          <div className="roles-title">Roles</div>
          <div className="role-cards">
            {group?.roles?.map((role: Role) => (
              <RoleCard role={role} key={role?.id} />
            ))}
          </div>
          <div className="individual-permission">
            <span
              style={{ color: "#2F6FED", cursor: "pointer" }}
              onClick={() => setOpenModal(true)}
            >
              View
            </span>{" "}
            individual permissions
          </div>
        </RoleCards>
      </Container>
      <If condition={openModal}>
        <CustomDialog
          title="Permissions"
          handleClose={() => setOpenModal(false)}
        >
          <DialogContent>
            {group?.permissions.map((permission: any) => (
              <CustomChip
                name={permission.label ?? permission.name}
                key={permission?.id}
              />
            ))}
          </DialogContent>
        </CustomDialog>
      </If>
    </>
  );
};

export default GroupCard;
