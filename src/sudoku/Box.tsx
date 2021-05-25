import Cell from "./Cell";
import styled from "styled-components";
import { CellProps } from "./Cell";

export type BoxType = {
  boxCells: CellProps[];
  boxCol: number;
  boxRow: number;
};

interface BoxContainerProps {
  color?: string;
}

export const boxColors = [
  "#a569bd",
  "#f5cba7",
  "#f5b041",
  "#5dade2",
  "#f7dc6f",
  "#48c9b0",
  "#ec7063",
  "#5499c7",
  "#7fb3d5",
];

const BoxContainer = styled.div<BoxContainerProps>`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  border: 1px solid;
  flex-wrap: wrap;
  display: flex;
  height: 200px;
  background-color: ${(props) => props.color ?? "black"};
  width: 200px;
  > * {
    flex: 0 0 33.3333%;
  }
`;

interface BoxProperties {
  cells: CellProps[];
  color?: string;
}

const Box = ({ cells, color }: BoxProperties) => {
  return (
    <BoxContainer color={color}>
      {cells.map((cell, index) => (
        <Cell
          value={cell.value}
          key={index}
          coordinates={cell.coordinates}
          isValueValid={cell.isValueValid}
          isInitial={cell.isInitial}
          color={color}
        />
      ))}
    </BoxContainer>
  );
};

export default Box;
