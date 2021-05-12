import styled, { css } from "styled-components";
import Board from "./Board";
import { useCallback, useState } from "react";
import { BoxType } from "./Box";
import { generateStartingBoard } from "./boardGenerator";

const GameSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const MenuSection = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 50px;
`;

export const MenuItem = css`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  min-width: 10em;
  height: 2em;
  margin: 10px 0px;
`;

const LoadFileButton = styled.input.attrs({
  type: "file",
})`
  ${MenuItem}
`;

const NewGameButton = styled.button`
  ${MenuItem}
`;

const generateRandom = () => {
  const generatedBoard = generateStartingBoard(17);
  const values2DArray = [...Array(9)].map((x) => Array(9));
  generatedBoard.forEach((cell) => {
    values2DArray[cell.coords[0]][cell.coords[1]] =
      cell.value === "" ? null : parseInt(cell.value);
  });

  return values2DArray;
};

const Game = () => {
  const [board, setBoard] = useState<(number | null)[][]>((): (
    | number
    | null
  )[][] => {
    return generateRandom();
  });

  const loadFile = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
      setBoard(JSON.parse(e.target.result)["sudokuBoard"]);
    };
  };

  const parseBoard = useCallback(
    (board: (number | null)[][]): BoxType[] => {
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
    },
    [board]
  );

  return (
    <GameSection>
      <Board board={parseBoard(board)} />
      <MenuSection>
        <LoadFileButton onChange={loadFile} />
        <NewGameButton
          onClick={() => {
            setBoard(generateRandom());
          }}
        >
          New Game
        </NewGameButton>
      </MenuSection>
    </GameSection>
  );
};

export default Game;
