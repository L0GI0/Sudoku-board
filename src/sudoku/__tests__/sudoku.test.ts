import {
  parseBoard,
  updateCellValue,
  getBoxIndex,
} from "../utils/boardBoxFormatControler";
import { validateBoard } from "../utils/boardValidator";
import { CellProps } from "../Cell";
import { BoxType } from "../Box";

const testBoard1 = require("./testBoards/test-board-1.JSON");
const testBoard2 = require("./testBoards/test-board-2.JSON");

let parsedBoard1: BoxType[];
let parsedBoard2: BoxType[];

test("Should verify loaded boards", () => {
  expect(testBoard1).not.toBeUndefined();
  expect(testBoard2).not.toBeUndefined();
});

test("Should parse the board to BoxType[] format", () => {
  parsedBoard1 = parseBoard(testBoard1["sudokuBoard"]);
  parsedBoard2 = parseBoard(testBoard2["sudokuBoard"]);
  expect(parsedBoard1).not.toBeUndefined();
  expect(parsedBoard2).not.toBeUndefined();

  expect(JSON.stringify(parsedBoard1)).toBe(
    JSON.stringify(testBoard1["boxFormat"])
  );

  expect(JSON.stringify(parsedBoard2)).toBe(
    JSON.stringify(testBoard2["boxFormat"])
  );
});

test("Should validate whole second board", () => {
  const { invalidCells, numOfMissingValues } = validateBoard(parsedBoard2);

  expect(invalidCells.length).toBe(0);
  expect(numOfMissingValues).toBe(0);
});

test("Should update board cells", () => {
  const cellToUpdate: CellProps = {
    value: null,
    coordinates: { x: 5, y: 0 },
    isInitial: false,
  };

  const cellToUpdate2: CellProps = {
    value: null,
    coordinates: { x: 1, y: 8 },
    isInitial: false,
  };

  const cellToUpdate3: CellProps = {
    value: null,
    coordinates: { x: 0, y: 6 },
    isInitial: false,
  };

  const { invalidCells } = validateBoard(parsedBoard1);
  expect(invalidCells.length).toBe(0);

  parsedBoard1 = updateCellValue(parsedBoard1, cellToUpdate, 5);
  parsedBoard1 = updateCellValue(parsedBoard1, cellToUpdate2, 5);
  parsedBoard1 = updateCellValue(parsedBoard1, cellToUpdate3, 8);

  expect(
    parsedBoard1[getBoxIndex(cellToUpdate.coordinates)].boxCells[
      (cellToUpdate.coordinates.x % 3) + (cellToUpdate.coordinates.y % 3) * 3
    ].value
  ).toBe(5);

  expect(
    parsedBoard1[getBoxIndex(cellToUpdate2.coordinates)].boxCells[
      (cellToUpdate2.coordinates.x % 3) + (cellToUpdate2.coordinates.y % 3) * 3
    ].value
  ).toBe(5);

  expect(
    parsedBoard1[getBoxIndex(cellToUpdate3.coordinates)].boxCells[
      (cellToUpdate3.coordinates.x % 3) + (cellToUpdate3.coordinates.y % 3) * 3
    ].value
  ).toBe(8);
});

test("Should find invalid cells on updated board", () => {
  const { invalidCells } = validateBoard(parsedBoard1);
  expect(invalidCells.length).toBe(5);

  const expectedInvalidCells =
    '[{"x":0,"y":6},{"x":1,"y":6},{"x":1,"y":0},{"x":1,"y":8},{"x":5,"y":0}]';

  expect(JSON.stringify(invalidCells)).toBe(expectedInvalidCells);
});
