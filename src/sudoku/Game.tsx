import styled, { css } from "styled-components";
import { useState, useRef } from "react";
import { generateRandomBoard, loadFile } from "./utils/boardBoxFormatParser";
import Board from "./Board";
import { BoxType } from "./Box";

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
  font-size: 18px;
  width: 150px;
  margin: 10px 0px;
`;

export const ButtonIcon = styled.i`
  margin: 0px 4px 5px 0px;
`;

const LoadFileInput = styled.input.attrs({
  type: "file",
})`
  visibility: hidden;
  max-width: 0px;
`;

const NewGameButton = styled.button.attrs({
  className: "btn btn-outline-dark",
})`
  ${MenuItem}
`;

const LoadFromFileButton = styled.button.attrs({
  className: "btn btn-dark",
})`
  ${MenuItem}
`;

const Game = () => {
  const [board, setBoard] = useState<BoxType[]>((): BoxType[] => {
    return generateRandomBoard();
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <GameSection>
      <Board board={board} />
      <MenuSection>
        <LoadFromFileButton
          onClick={() => {
            inputFileRef.current?.click();
          }}
        >
          <ButtonIcon className="bi bi-upload" />
          Upload
          <LoadFileInput
            onChange={(e) => {
              loadFile(e).then((loadedBoard) => {
                setBoard(loadedBoard);
              });
            }}
            ref={inputFileRef}
          />
        </LoadFromFileButton>
        <NewGameButton
          onClick={() => {
            setBoard(generateRandomBoard);
          }}
        >
          <ButtonIcon className="bi bi-dice-5" />
          New Game
        </NewGameButton>
      </MenuSection>
    </GameSection>
  );
};

export default Game;
