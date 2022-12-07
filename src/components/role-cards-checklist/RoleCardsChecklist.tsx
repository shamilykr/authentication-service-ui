import { Checkbox } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Role } from "../../types/role";
import RoleCard from "../role-card/RoleCard";
import { ReactComponent as UnCheckedIcon } from "../../assets/icons/uncheckedicon.svg";
import { ReactComponent as CheckedIcon } from "../../assets/icons/checkedicon.svg";
import styled from "@emotion/styled";

interface Props {
  roleList: Role[];
  currentCheckedItems: Role[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, item?: any) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-top: 10px;
  font-family: "Manrope";
`;

const SelectAll = styled.div`
  display: flex;
  column-gap: 6px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 16px;
  row-gap: 18px;
`;

const RoleCardsChecklist: FC<Props> = ({
  roleList,
  currentCheckedItems,
  onChange = () => null,
}) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectAll(true);
    else setSelectAll(false);
    onChange(e);
  };

  const isChecked = (id: string) => {
    return currentCheckedItems.some((item) => item.id === id);
  };

  useEffect(() => {
    if (roleList?.length === currentCheckedItems?.length) {
      setSelectAll(true);
    } else setSelectAll(false);
  }, [roleList, currentCheckedItems]);

  return (
    <Container>
      <SelectAll>
        <Checkbox
          value={"all"}
          onChange={handleSelectAll}
          checked={selectAll}
          className="custom-checkbox"
          icon={<UnCheckedIcon />}
          checkedIcon={<CheckedIcon />}
        />
        <span style={{ marginLeft: "5px", marginBottom: "7px" }}>
          Select All
        </span>
      </SelectAll>
      <CardsContainer>
        {roleList?.map((role: Role) => (
          <RoleCard
            role={role}
            checked={isChecked(role.id)}
            onChange={onChange}
          />
        ))}
      </CardsContainer>
    </Container>
  );
};

export default RoleCardsChecklist;
