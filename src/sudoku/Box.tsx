import Cell from "./Cell";
import styled from "styled-components";
import { CellProps } from "./Cell";

export type BoxType = {
  boxCells: CellProps[];
  boxCol: number;
  boxRow: number;
};

type BoxColors =
  | "white"
  | "blue"
  | "red"
  | "yellow"
  | "orange"
  | "red"
  | "green"
  | "purple"
  | string;

interface BoxContainerProps {
  color: BoxColors;
}

const BoxContainer = styled.div<BoxContainerProps>`
  color: green;
  position: relative;
  box-shadow: 4px 0 0 0 black, 0 4px 0 0 black, 4px 4px 0 0 black,
    4px 0 0 0 black inset, 0 4px 0 0 black inset;
  flex-wrap: wrap;
  display: flex;
  height: 200px;
  background-color: ${(props) => props.color};
  width: 200px;
  > * {
    flex: 0 0 33.3333%;
  }
`;

interface BoxProperties {
  cells: CellProps[];
  row: number;
  col: number;
  color?: BoxColors;
}

const Box = ({ cells, row, col, color = "white" }: BoxProperties) => {
  return (
    <BoxContainer color={color}>
      {cells.map((cell, index) => (
        <Cell
          value={cell.value}
          key={index}
          coordinates={cell.coordinates}
          isValueValid={cell.isValueValid}
        />
      ))}
    </BoxContainer>
  );
};

export default Box;
