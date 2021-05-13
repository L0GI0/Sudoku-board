import styled from "styled-components";
import { useCellFocus } from "./Board";

interface CellContainerPorps {
  isCellValid: boolean;
  isInitial: boolean;
}

const CellContainer = styled.div<CellContainerPorps>`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-weight: ${(props) => (props.isInitial ? "bold" : "normal")};
  border: 1px solid;
  border-color: white;
  display: flex;
  pointer-events: ${(props) => (props.isInitial ? "none" : "auto")};
  color: ${(props) =>
    props.isCellValid ? (props.isInitial ? "#34495e" : "white") : "#FF4136"};
  font-size: 30px;
  height: 66px;
  align-items: center;
  justify-content: center;
  transition: font-size 0.1s;
  :hover {
    font-size: 35px;
    cursor: pointer;
  }
`;

export interface CellCoordinates {
  x: number;
  y: number;
}

export interface CellProps {
  value: number | null;
  coordinates: CellCoordinates;
  isInitial: boolean;
  isValueValid?: boolean;
}

const Cell = (props: CellProps) => {
  const focusCell = useCellFocus();
  return (
    <CellContainer
      isCellValid={props.isValueValid ?? true}
      isInitial={props.isInitial}
      onClick={() => focusCell(props)}
    >
      {props.value ?? ""}
    </CellContainer>
  );
};

export default Cell;
