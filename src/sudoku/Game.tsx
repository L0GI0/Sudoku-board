import styled, { css } from "styled-components";
import Board from "./Board";
import { useState } from "react";
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

const MenuItem = css`
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

  const parseBoard = (board: (number | null)[][]): BoxType[] => {
    const boxes = new Array<BoxType>(0);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        boxes[Math.floor(i / 3) * 3 + Math.floor(j / 3)]
          ? boxes[Math.floor(i / 3) * 3 + Math.floor(j / 3)].boxCells.push({
              value: board[i][j],
              coordinates: { x: j, y: i },
            })
          : boxes.push(
              Object({
                boxCol: Math.floor(j / 3),
                boxRow: Math.floor(i / 3),
                boxCells: [{ value: board[i][j], coordinates: { x: j, y: i } }],
              } as BoxType)
            );
      }
    }

    return boxes;
  };

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
