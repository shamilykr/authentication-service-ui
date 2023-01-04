import styled from "@emotion/styled";
import { FC } from "react";

interface ChipProps {
  name: string;
  fontSize?: string;
}

const Container = styled.div<{ fontSize: string }>`
  display: block;
  background: #eaf1fd;
  border-radius: 6px;
  height: 26px;
  font-size: ${(props) => props.fontSize};
  padding: 2px 8px 0px 8px;
  max-width: calc(50% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CustomChip: FC<ChipProps> = ({ name, fontSize = "14px" }) => {
  return <Container fontSize={fontSize}>{name}</Container>;
};

export default CustomChip;
