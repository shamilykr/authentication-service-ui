import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import { FC } from "react";
import { Role } from "../../types/role";
import CustomChip from "../custom-chip/CustomChip";
import { ReactComponent as UnCheckedIcon } from "../../assets/icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "../../assets/icons/checkedicon.svg";
import If from "../If/If";

interface RoleCardProps {
  role: Role;
  checked?: boolean | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, item?: any) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #d2d5dd;
  border-radius: 6px;
  width: 312px;
  height: 121px;
`;

const RoleNameCntr = styled.div`
  display: flex;
  align-items: center;
  height: 45px;
  column-gap: 12px;
  border-bottom: 1px solid #d2d5dd;
  padding-left: 14px;
  padding: 4px 0px 4px 14px;
`;

const RoleName = styled.div`
  font-size: 14px;
`;

const RolePermissions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  height: inherit;
  overflow: hidden;
  margin: 10px 15px;
  align-items: center;
  justtify-content: center;
`;

const RoleCard: FC<RoleCardProps> = ({
  role,
  checked = null,
  onChange = () => null,
}) => {
  return (
    <Container>
      <RoleNameCntr>
        {checked !== null && (
          <Checkbox
            onChange={(e) => onChange(e, role)}
            checked={checked}
            className="custom-checkbox"
            icon={<UnCheckedIcon />}
            checkedIcon={<CheckedIcon />}
          />
        )}
        <RoleName>{role.name}</RoleName>
      </RoleNameCntr>
      <RolePermissions>
        <If condition={role.permissions.length !== 0}>
          {role.permissions.map((permission) => (
            <CustomChip name={permission.name} key={permission?.id} />
          ))}
        </If>
        <If condition={role.permissions.length === 0}>
          <span>No permissions assigned to this Role</span>
        </If>
      </RolePermissions>
    </Container>
  );
};

export default RoleCard;
