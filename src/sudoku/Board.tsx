import Box, { BoxType } from "./Box";
import styled from "styled-components";
import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import DigitSelector from "./DigitSelector";
import { CellProps, CellCoordinates } from "./Cell";
import { boxColors } from "./Box";

export type BoardType = { board: BoxType[] };

const BoardSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const BoardContainer = styled.div`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  width: 600px;
  height: 600px;
  align-items: center;
  flex-wrap: wrap;
  > * {
    flex: 0 0 33.3333%;
  }
`;

interface ValidateButtonProps {
  isValidating: boolean;
}

const ValidateButton = styled.button<ValidateButtonProps>`
  display: flex;
  text-align: center;
  background-color: ${(props) => (props.isValidating ? "green" : "white")};
  justify-content: center;
  align-items: center;
  font-size: 12px;
  min-width: 10em;
  height: 2em;
  margin: 10px 0px;
`;

const CellFocusContext = createContext((cell: CellProps | null) => {});

export function useCellFocus() {
  return useContext(CellFocusContext);
}

interface BoardProps {
  board: BoxType[];
}

const Board = ({ board }: BoardProps) => {
  const [focusedCell, setFocusedCell] = useState<CellProps | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoxType[]>(board);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    setCurrentBoard(board);
  }, [board]);

  const focusCell = (cell: CellProps | null) => {
    setFocusedCell(cell);
  };

  const getBoxIndex = ({ x, y }: CellCoordinates) => {
    return Math.floor(y / 3) * 3 + Math.floor(x / 3);
  };

  const updateBoardCellValue = (newValue: number) => {
    if (!focusedCell) return;

    setCurrentBoard((boardToChange) => {
      const updatedBoard = [...boardToChange];
      updatedBoard[getBoxIndex(focusedCell.coordinates)].boxCells[
        (focusedCell.coordinates.x % 3) + (focusedCell.coordinates.y % 3) * 3
      ].value = newValue;
      return updatedBoard;
    });
  };

  const getClearedCurrentBoard = () => {
    const inValidatedBoard = [...currentBoard];

    inValidatedBoard.forEach((box) => {
      box.boxCells.forEach((cell) => {
        cell.isValueValid = true;
      });
    });

    return inValidatedBoard;
  };

  const validateBoard = useCallback(() => {
    const findDuplicates = (cells: CellProps[]) => {
      const cellsValues = new Array<number | null>(0);

      cells.forEach((cell) => {
        cellsValues.push(cell.value);
      });

      const duplicates = new Array<CellCoordinates>(0);

      for (let i = 0; i < cellsValues.length; i++) {
        if (!cellsValues[i]) continue;
        const indexOfFirstCell = cellsValues.indexOf(cellsValues[i]);
        const indexOfSecondCell = cellsValues.lastIndexOf(cellsValues[i]);
        if (indexOfFirstCell !== indexOfSecondCell) {
          duplicates.push(cells[i].coordinates);
        }
      }
      return duplicates;
    };

    const createCoordinatesMaps = () => {
      type coordinatesMapType = { [key: number]: CellProps[] };

      const xCoordinatesMap: coordinatesMapType = {};
      const yCoordinatesMap: coordinatesMapType = {};

      currentBoard.forEach((box) => {
        box.boxCells.forEach((cell) => {
          xCoordinatesMap[cell.coordinates.x]
            ? (xCoordinatesMap[cell.coordinates.x] = [
                ...xCoordinatesMap[cell.coordinates.x],
                cell,
              ])
            : (xCoordinatesMap[cell.coordinates.x] = [cell]);

          yCoordinatesMap[cell.coordinates.y]
            ? (yCoordinatesMap[cell.coordinates.y] = [
                ...yCoordinatesMap[cell.coordinates.y],
                cell,
              ])
            : (yCoordinatesMap[cell.coordinates.y] = [cell]);
        });
      });
      return [xCoordinatesMap, yCoordinatesMap];
    };

    const invalidCells = new Array<CellCoordinates>(0);

    currentBoard?.forEach((box) => {
      invalidCells.push.apply(invalidCells, findDuplicates(box.boxCells));
    });

    const [xCoordinatesMap, yCoordinatesMap] = createCoordinatesMaps();

    Object.values(xCoordinatesMap).forEach((row) => {
      invalidCells.push.apply(invalidCells, findDuplicates(row));
    });

    Object.values(yCoordinatesMap).forEach((row) => {
      invalidCells.push.apply(invalidCells, findDuplicates(row));
    });

    const validatedBoard = getClearedCurrentBoard();

    invalidCells.forEach((invalidCell) => {
      validatedBoard[getBoxIndex(invalidCell)].boxCells[
        (invalidCell.x % 3) + (invalidCell.y % 3) * 3
      ].isValueValid = false;
    });

    setCurrentBoard(validatedBoard);
  }, [currentBoard]);

  useEffect(() => {
    isValidating ? validateBoard() : setCurrentBoard(getClearedCurrentBoard());
  }, [focusedCell, isValidating]);

  return (
    <BoardSection>
      <ValidateButton
        isValidating={isValidating}
        onClick={() => {
          setIsValidating((isValidatingPrev) => !isValidatingPrev);
        }}
      >
        Validate
      </ValidateButton>
      <BoardContainer>
        <CellFocusContext.Provider value={focusCell}>
          {currentBoard?.map((box, index) => (
            <Box key={index} cells={box.boxCells} color={boxColors[index]} />
          ))}
          <DigitSelector
            focusedCell={focusedCell}
            updateCellValue={updateBoardCellValue}
          />
        </CellFocusContext.Provider>
      </BoardContainer>
    </BoardSection>
  );
};

export default Board;
