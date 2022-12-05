import styled from "@emotion/styled";
import { Chip } from "@mui/material";
import { FC } from "react";
import { Role } from "../../types/role";
import CustomChip from "../custom-chip/CustomChip";

interface RoleCardProps {
  role: Role;
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
  height: 38px;
  border-bottom: 1px solid #d2d5dd;
`;

const RoleName = styled.div`
  font-size: 14px;
  padding-left: 15px;
  margin-top: 12px;
  margin-bottom: 7px;
`;

const RolePermissions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  height: inherit;
  overflow: hidden;
  margin: 10px 15px;
`;

const RoleCard: FC<RoleCardProps> = ({ role }) => {
  return (
    <Container>
      <RoleNameCntr>
        <RoleName>{role.name}</RoleName>
      </RoleNameCntr>
      <RolePermissions>
        {role.permissions.map((permission) => (
          <CustomChip name={permission.name} />
        ))}
      </RolePermissions>
    </Container>
  );
};

export default RoleCard;
