import styled from "styled-components";
import { useCellFocus } from "./Board";

interface CellContainerPorps {
  isCellValid: boolean;
}

const CellContainer = styled.div<CellContainerPorps>`
  box-shadow: 2px 0 0 0 black, 0 2px 0 0 black, 2px 2px 0 0 black,
    2px 0 0 0 black inset, 0 2px 0 0 black inset;
  display: flex;
  background-color: ${(props) => (props.isCellValid ? "white" : "red")};
  font-size: 30px;
  height: 66px;
  align-items: center;
  justify-content: center;
  color: #000099;
  transition: all 0.3s;

  :hover {
    cursor: pointer;
    opacity: 0.3;
  }
`;

export interface CellCoordinates {
  x: number;
  y: number;
}

export interface CellProps {
  value: number | null;
  coordinates: CellCoordinates;
  isValueValid?: boolean;
}

const Cell = (props: CellProps) => {
  const focusCell = useCellFocus();
  return (
    <CellContainer
      isCellValid={props.isValueValid ?? true}
      onClick={() => focusCell(props)}
    >
      {props.value ?? ""}
    </CellContainer>
  );
};

export default Cell;
