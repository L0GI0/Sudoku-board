import { BoxType } from "../Box";
import { generateStartingBoard } from "./boardGenerator";

export const parseBoard = (board: (number | null)[][]): BoxType[] => {
  const boxes = new Array<BoxType>(0);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cellValue = board[i][j];
      boxes[Math.floor(i / 3) * 3 + Math.floor(j / 3)]
        ? boxes[Math.floor(i / 3) * 3 + Math.floor(j / 3)].boxCells.push({
            value: cellValue,
            coordinates: { x: j, y: i },
            isInitial: cellValue ? true : false,
          })
        : boxes.push(
            Object({
              boxCol: Math.floor(j / 3),
              boxRow: Math.floor(i / 3),
              boxCells: [
                {
                  value: cellValue,
                  coordinates: { x: j, y: i },
                  isInitial: cellValue ? true : false,
                },
              ],
            } as BoxType)
          );
    }
  }

  return boxes;
};

export const generate2DBoard = () => {
  const generatedBoard = generateStartingBoard(17);
  const values2DArray = [...Array(9)].map((x) => Array(9));
  generatedBoard.forEach((cell) => {
    values2DArray[cell.coords[0]][cell.coords[1]] =
      cell.value === "" ? null : parseInt(cell.value);
  });

  return values2DArray;
};

export const loadFile = async (e: any): Promise<BoxType[]> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
      resolve(parseBoard(JSON.parse(e.target.result)["sudokuBoard"]));
    };
  });
};

export const generateRandomBoard = () => {
  return parseBoard(generate2DBoard());
};
