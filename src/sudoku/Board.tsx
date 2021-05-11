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

export type BoardType = { board: BoxType[] };

const BoardContainer = styled.div`
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

const CellFocusContext = createContext((cell: CellProps | null) => {});

export function useCellFocus() {
  return useContext(CellFocusContext);
}

const Board = ({ board }: BoardType) => {
  const [focusedCell, setFocusedCell] = useState<CellProps | null>(null);
  const focusCell = (cell: CellProps | null) => {
    setFocusedCell(cell);
  };

  const [currentBoard, setCurrentBoard] = useState<BoardType>({ board });

  useEffect(() => {
    setCurrentBoard({ board });
  }, [board]);

  const getBoxIndex = ({ x, y }: CellCoordinates) => {
    return Math.floor(y / 3) * 3 + Math.floor(x / 3);
  };

  const updateBoardCellValue = (newValue: number) => {
    if (!focusedCell) return;

    setCurrentBoard((boardToChange) => {
      const updatedBoard = [...boardToChange.board];
      updatedBoard[getBoxIndex(focusedCell.coordinates)].boxCells[
        (focusedCell.coordinates.x % 3) + (focusedCell.coordinates.y % 3) * 3
      ].value = newValue;
      return { board: updatedBoard };
    });
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

      currentBoard.board.forEach((box) => {
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

    currentBoard?.board.forEach((box) => {
      invalidCells.push.apply(invalidCells, findDuplicates(box.boxCells));
    });

    const [xCoordinatesMap, yCoordinatesMap] = createCoordinatesMaps();

    Object.values(xCoordinatesMap).forEach((row) => {
      invalidCells.push.apply(invalidCells, findDuplicates(row));
    });

    Object.values(yCoordinatesMap).forEach((row) => {
      invalidCells.push.apply(invalidCells, findDuplicates(row));
    });

    if (invalidCells.length === 0) return;

    const validatedBoard = [...currentBoard.board];

    invalidCells.forEach((invalidCell) => {
      validatedBoard[getBoxIndex(invalidCell)].boxCells[
        (invalidCell.x % 3) + (invalidCell.y % 3) * 3
      ].isValueValid = false;
    });

    setCurrentBoard({ board: validatedBoard });
  }, [currentBoard]);

  useEffect(() => {
    validateBoard();
  }, [focusedCell, validateBoard]);

  return (
    <BoardContainer onClick={validateBoard}>
      <CellFocusContext.Provider value={focusCell}>
        {currentBoard?.board?.map((box, index) => (
          <Box
            key={index}
            cells={box.boxCells}
            row={box.boxRow}
            col={box.boxCol}
          />
        ))}
        <DigitSelector
          focusedCell={focusedCell}
          updateCellValue={updateBoardCellValue}
        />
      </CellFocusContext.Provider>
    </BoardContainer>
  );
};

export default Board;
