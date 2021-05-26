import { BoxType } from "../Box";
import { CellProps, CellCoordinates } from "../Cell";
import { getBoxIndex } from "./boardBoxFormatControler";

export const validateBoard = (board: BoxType[]) => {
  let invalidCells = new Array<CellCoordinates>(0);

  let numOfMissingValues = 0;

  board?.forEach((box) => {
    const { duplicates: boxDuplicates, missingValues } = findDuplicates(
      box.boxCells
    );
    numOfMissingValues += missingValues;
    invalidCells.push.apply(invalidCells, boxDuplicates);
  });

  const [xCoordinatesMap, yCoordinatesMap] = createCoordinatesMaps(board);

  Object.values(xCoordinatesMap).forEach((row) => {
    const { duplicates: rowDuplicates } = findDuplicates(row);
    invalidCells.push.apply(invalidCells, rowDuplicates);
  });

  Object.values(yCoordinatesMap).forEach((col) => {
    const { duplicates: colDuplicates } = findDuplicates(col);
    invalidCells.push.apply(invalidCells, colDuplicates);
  });

  const validatedBoard = getClearedBoard(board);

  invalidCells = [...new Set(invalidCells)];

  invalidCells.forEach((invalidCell) => {
    validatedBoard[getBoxIndex(invalidCell)].boxCells[
      (invalidCell.x % 3) + (invalidCell.y % 3) * 3
    ].isValueValid = false;
  });

  console.log(`Invalid cells = ${JSON.stringify(invalidCells)}`);

  return { validatedBoard, invalidCells, numOfMissingValues };
};

export const createCoordinatesMaps = (board: BoxType[]) => {
  type coordinatesMapType = { [key: number]: CellProps[] };

  const xCoordinatesMap: coordinatesMapType = {};
  const yCoordinatesMap: coordinatesMapType = {};

  board.forEach((box) => {
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

export const findDuplicates = (cells: CellProps[]) => {
  const cellsValues = new Array<number | null>(0);

  cells.forEach((cell) => {
    cellsValues.push(cell.value);
  });

  const duplicates = new Array<CellCoordinates>(0);
  let missingValues = 0;

  for (let i = 0; i < cellsValues.length; i++) {
    if (!cellsValues[i]) {
      missingValues += 1;
      continue;
    }
    const indexOfFirstCell = cellsValues.indexOf(cellsValues[i]);
    const indexOfSecondCell = cellsValues.lastIndexOf(cellsValues[i]);
    if (indexOfFirstCell !== indexOfSecondCell) {
      duplicates.push(cells[i].coordinates);
    }
  }
  return { duplicates, missingValues };
};

export const getClearedBoard = (board: BoxType[]) => {
  const invalidatedBoard = [...board];

  invalidatedBoard.forEach((box) => {
    box.boxCells.forEach((cell) => {
      cell.isValueValid = true;
    });
  });

  return invalidatedBoard;
};
