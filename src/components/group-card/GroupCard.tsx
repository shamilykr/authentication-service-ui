import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import { FC, useState } from "react";

import { Role } from "../../types/role";
import RoleCard from "../role-card/RoleCard";
import { ReactComponent as DownArrowIcon } from "../../assets/icons/Stroke 1.svg";
import { getUniquePermissionsFromRoles } from "../../utils/permissions";
import { ReactComponent as UnCheckedIcon } from "../../assets/icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "../../assets/icons/checkedicon.svg";

import "../checklist/styles.css";
import { Group } from "../../types/group";

interface GroupCardProps {
  group: any;
  currentCheckedItems: Group[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, item?: any) => void;
}
interface TabProps {
  checked?: boolean;
}

const Container = styled.div`
  font-family: "Manrope";
`;

const CheckBoxComponent = styled.div<{ showRoles: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d2d5dd;
  box-sizing: border-box;
  border-radius: ${(props) => (props.showRoles ? "6px 6px 0px 0px" : "6px")};
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

const StyledDownArrowIcon = styled(DownArrowIcon)<{ showRoles: boolean }>`
  transform: ${(props) => (props.showRoles ? "rotate(180deg)" : "")};
  cursor: pointer;
`;

const RoleCards = styled.div<{ showRoles: boolean }>`
  display: ${(props) => (props.showRoles ? "flex" : "none")};
  flex-direction: column;
  padding: 0px 24px 24px 24px;
  border: 1px solid #d2d5dd;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: none;
`;

const GroupCard: FC<GroupCardProps> = ({
  group,
  currentCheckedItems,
  onChange,
}) => {
  const [showRoles, setShowRoles] = useState<boolean>(false);

  const isChecked = (id: string) => {
    return currentCheckedItems.some((item) => item.id === id);
  };

  return (
    <Container>
      <CheckBoxComponent key={group.id} showRoles={showRoles}>
        <div className="checkbox-label">
          <Checkbox
            key={group.id}
            checked={isChecked(group.id)}
            onChange={(e) => onChange(e, group)}
            className="custom-checkbox"
            icon={<UnCheckedIcon />}
            checkedIcon={<CheckedIcon />}
          />
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
            showRoles={showRoles}
          />
        </div>
      </CheckBoxComponent>
      <RoleCards showRoles={showRoles}>
        <div className="roles-title">Roles</div>
        <div className="role-cards">
          {group?.roles?.map((role: Role) => (
            <RoleCard role={role} />
          ))}
        </div>
      </RoleCards>
    </Container>
  );
};

export default GroupCard;
