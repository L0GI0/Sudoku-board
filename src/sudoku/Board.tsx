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
import { CellProps } from "./Cell";
import { boxColors } from "./Box";
import { getClearedBoard, validateBoard } from "./utils/boardValidator";
import { getBoxIndex, updateCellValue } from "./utils/boardBoxFormatControler";

interface BoardProps {
  board: BoxType[];
}

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
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  > * {
    flex: 0 0 33.3333%;
  }
`;

interface ValidateButtonProps {
  isValidating: boolean;
  isValidConfirmed: boolean;
}

const ValidateButton = styled.button.attrs<ValidateButtonProps>(
  ({ isValidating, isValidConfirmed }) => ({
    className: isValidating
      ? isValidConfirmed
        ? "btn btn-success"
        : "btn btn-danger"
      : "btn btn-light",
  })
)<ValidateButtonProps>`
  display: flex;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 50px 0px;
`;

const ValidateIcon = styled.i.attrs<Pick<ValidateButtonProps, "isValidating">>(
  ({ isValidating }) => ({
    className: isValidating ? "bi bi-check-circle-fill" : "bi bi-check-circle",
  })
)<Pick<ValidateButtonProps, "isValidating">>`
  margin: 0px 4px 4px 0px;
`;

const SolvedText = styled.div`
  position: absolute;
  display: flex;
  font-size: 150px;
  justify-content: center;
  align-items: center;
  color: #34495e;
  box-shadow: 0px 0px 20px 5px rgba(40, 167, 69, 255);
  text-shadow: 0px 0px 50px white;
  backdrop-filter: blur(1px);
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const CellFocusContext = createContext((cell: CellProps | null) => {});

export function useCellFocus() {
  return useContext(CellFocusContext);
}

type BoardType = {
  board: BoxType[];
  isValid: boolean;
  missingValues?: number;
};

const Board = ({ board }: BoardProps) => {
  const [focusedCell, setFocusedCell] = useState<CellProps | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardType>({
    board: board,
    isValid: true,
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    setCurrentBoard((prevBoard) => {
      return { board: board, isValid: prevBoard.isValid };
    });
    focusCell(null);
    setIsValidating(false);
  }, [board]);

  useEffect(() => {
    isValidating
      ? validateCurrentBoard()
      : setCurrentBoard((prevBoard) => {
          return {
            board: getClearedBoard(currentBoard.board),
            isValid: prevBoard.isValid,
          };
        });
  }, [focusedCell, isValidating]);

  const focusCell = (cell: CellProps | null) => {
    setFocusedCell(cell);
  };

  const updateBoardCellValue = (newValue: number) => {
    if (!focusedCell) return;

    setCurrentBoard((boardToChange) => {
      return {
        board: updateCellValue(boardToChange.board, focusedCell, newValue),
        isValid: boardToChange.isValid,
      };
    });
  };

  const validateCurrentBoard = useCallback(() => {
    const { validatedBoard, invalidCells, numOfMissingValues } = validateBoard(
      currentBoard.board
    );
    const isBoardValid = invalidCells.length === 0 ? true : false;

    setCurrentBoard({
      board: validatedBoard,
      isValid: isBoardValid,
      missingValues: numOfMissingValues,
    });
  }, [currentBoard]);

  return (
    <BoardSection>
      <ValidateButton
        isValidating={isValidating}
        isValidConfirmed={currentBoard.isValid}
        onClick={() => {
          setIsValidating((isValidatingPrev) => !isValidatingPrev);
        }}
      >
        <ValidateIcon isValidating={isValidating} />
        Validate
      </ValidateButton>
      <BoardContainer>
        {currentBoard?.missingValues === 0 && <SolvedText>Solved!</SolvedText>}
        <CellFocusContext.Provider value={focusCell}>
          {currentBoard?.board?.map((box, index) => (
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
