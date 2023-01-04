import styled from "@emotion/styled";
import { Checkbox, Button } from "@mui/material";
import { FC, useState } from "react";
import { Role } from "types/role";
import CustomChip from "components/custom-chip";
import { ReactComponent as UnCheckedIcon } from "assets/checkbox-icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "assets/checkbox-icons/checkedicon.svg";
import If from "../if";
import CustomDialog from "components/custom-dialog";
import { useMediaQuery } from "react-responsive";

interface RoleCardProps {
  role: Role;
  checked?: boolean | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, item?: any) => void;
}

const Container = styled.div<{ isPortrait: boolean }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #d2d5dd;
  border-radius: 6px;
  width: ${(props) => (props.isPortrait ? "95%" : "calc(33.33% - (32px / 3))")};
  height: 161px;
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

const RolePermissions = styled.div<{ isPortrait: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  height: ${(props) => (props.isPortrait ? "80%" : "inherit")};
  overflow: hidden;
  margin: 10px 15px;
  align-items: center;
`;

const DialogContent = styled.div`
  width: 93%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 0px 20px 30px 20px;
`;
const RoleCard: FC<RoleCardProps> = ({
  role,
  checked = null,
  onChange = () => null,
}) => {
  const [open, setOpen] = useState(false);

  const isPortrait = useMediaQuery({ orientation: "portrait" });
  const isDesktopScreen = useMediaQuery({ query: "(min-width: 1746px)" });
  const isMobileScreen = useMediaQuery({ query: "(max-width: 767px)" });

  const minChips = isDesktopScreen ? 7 : isMobileScreen ? 3 : 5;

  const arryLength = role.permissions?.length;
  const mappingArray =
    arryLength > minChips
      ? role.permissions?.slice(0, minChips)
      : role.permissions;

  return (
    <>
      <Container isPortrait={isPortrait}>
        <RoleNameCntr>
          {checked !== null && (
            <Checkbox
              onChange={(e) => onChange(e, role)}
              checked={checked}
              icon={<UnCheckedIcon />}
              checkedIcon={<CheckedIcon />}
            />
          )}
          <RoleName>{role.name}</RoleName>
        </RoleNameCntr>
        <RolePermissions isPortrait={isPortrait}>
          <If condition={role.permissions.length !== 0}>
            {mappingArray.map((permission) => (
              <CustomChip
                name={permission.label ?? permission.name}
                key={permission?.id}
                fontSize={isPortrait ? "16px" : "14px"}
              />
            ))}
            <If condition={arryLength > minChips}>
              <Button
                variant="contained"
                sx={{ height: "25px", fontSize: isPortrait ? 15 : 13 }}
                onClick={() => setOpen(true)}
              >
                +{arryLength - minChips} more
              </Button>
            </If>
          </If>
          <If condition={role.permissions.length === 0}>
            <span>No permissions assigned to this Role</span>
          </If>
        </RolePermissions>
      </Container>
      <If condition={open}>
        <CustomDialog title="Permissions" handleClose={() => setOpen(false)}>
          <DialogContent>
            {role.permissions.map((permission) => (
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

export default RoleCard;
