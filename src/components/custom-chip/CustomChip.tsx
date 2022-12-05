import styled from "@emotion/styled";
import { FC } from "react";

interface ChipProps {
  name: string;
}

const Container = styled.div`
  display: block;
  background: #eaf1fd;
  border-radius: 6px;
  height: 26px;
  font-size: 14px;
  padding: 2px 8px 0px 8px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CustomChip: FC<ChipProps> = ({ name }) => {
  return <Container>{name}</Container>;
};

export default CustomChip;
