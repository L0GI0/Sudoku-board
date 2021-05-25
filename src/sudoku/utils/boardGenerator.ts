var _ = require("lodash");

type Coords = Array<number>;

class Cell {
  coords: Coords;
  value: string;
  initial: boolean;
  classes: Set<string>;

  constructor(
    coords: Coords = [],
    value = "",
    initial = false,
    classes = new Set(["square"])
  ) {
    this.coords = coords;
    this.value = value;
    this.initial = initial;
    this.classes = classes;
  }
}

type Cells = Cell[];

export function getNeighbours(coords: Coords, cells: Cells): Cells {
  cells = resetCoords(cells);
  let neighbours = new Set<Cell>();
  for (let i: number = 0; i < 9; i++) {
    if (i !== coords[1]) neighbours.add(getCell(coords[0], i, cells));
    if (i !== coords[0]) neighbours.add(getCell(i, coords[1], cells));
  }

  let iBlockStart = Math.floor(coords[0] / 3) * 3;
  let jBlockStart = Math.floor(coords[1] / 3) * 3;

  for (let j = iBlockStart; j < iBlockStart + 3; j++) {
    for (let k = jBlockStart; k < jBlockStart + 3; k++) {
      if (j !== coords[0] || k !== coords[1])
        neighbours.add(getCell(j, k, cells));
    }
  }
  return Array.from(neighbours);
}

export function getCell(x: number, y: number, cells: Cells) {
  return cells.filter(function (cell) {
    return cell.coords[0] === x && cell.coords[1] === y;
  })[0];
}

export function fillCells(cells: Cells) {
  let remainingCells: Cells = cells.slice();
  generateCellValues(remainingCells, cells);
}

export function generateCellValues(remainingCells: Cells, cells: Cells) {
  const remainingCell = remainingCells.shift();
  if (!remainingCell) return false;
  let cell: Cell = remainingCell;
  let neighbours: Cells = getNeighbours(cell.coords, cells);
  let options = _.difference(
    _.range(1, 10),
    neighbours.map((neighbour) => neighbour.value)
  );
  for (let option of _.shuffle(options)) {
    cell.value = option;
    if (remainingCells.length === 0) {
      return true;
    }

    if (generateCellValues(remainingCells, cells)) {
      return true;
    }
  }

  cell.value = "";
  remainingCells.unshift(cell);
  return false;
}

export function cellsToPosition(cells: Cells) {
  let positionedCells: Cells = [];
  let index: number;

  for (let t = 0; t < 3; t++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          index = 27 * t + i * 3 + j * 9 + k;
          positionedCells.push(cells[index]);
        }
      }
    }
  }
  return positionedCells;
}

export function resetCoords(cells: Cells) {
  let coords: Coords[] = [];
  for (let i: number = 0; i < 9; i++) {
    for (let j: number = 0; j < 9; j++) {
      coords.push([i, j]);
    }
  }
  cells.forEach((cell) => {
    const currentCoords = coords.shift();
    if (currentCoords) cell.coords = currentCoords;
  });
  return cells;
}

export function initCells() {
  let cells = [];
  for (let i: number = 0; i < 9; i++) {
    for (let j: number = 0; j < 9; j++) {
      cells.push(new Cell([i, j]));
    }
  }
  return cells;
}

export function generateStartingBoard(numOfInitialCells: number) {
  let cells = initCells();
  const numOfCells = 81;
  fillCells(cells);
  let sudoku = cellsToPosition(cells);
  let board = initCells();
  _.shuffle(_.range(numOfCells))
    .slice(numOfCells - numOfInitialCells)
    .forEach((i: number) => {
      sudoku[i].initial = true;
      sudoku[i].classes.add(" initial");
      board[i] = sudoku[i];
    });
  return board;
}
