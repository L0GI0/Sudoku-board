import styled from "styled-components";
import { CellProps } from "./Cell";
import { useCellFocus } from "./Board";

interface DigitCellProps {
  isSelected: boolean;
  isValid: boolean;
}

const DigitCell = styled.div<DigitCellProps>`
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.isSelected ? (props.isValid ? "blue" : "red") : "white"};
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;
  :hover {
    opacity: 0.5;
    color: white;
  }
`;

type SelectorProps = {
  top: number;
  left: number;
};

const Selector = styled.div<SelectorProps>`
  position: relative;
  left: ${(props) => props.left}px;
  bottom: ${(props) => props.top}px;
  display: flex;
  flex-wrap: wrap;
  height: 66px;
  max-width: 66px;
  align-items: center;
  justify-content: center;
  background-color: grey;
  border: 1px solid;
  > * {
    flex: 0 0 33.3333%;
  }
`;

interface DigitSelectorProps {
  focusedCell: CellProps | null;
  updateCellValue: (newValue: number) => void;
}

const DigitSelector = ({
  focusedCell,
  updateCellValue,
}: DigitSelectorProps) => {
  const focusCell = useCellFocus();

  const sudokuDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return focusedCell ? (
    <Selector
      top={600 - 66.65 * focusedCell?.coordinates.y}
      left={66.65 * focusedCell?.coordinates.x}
    >
      {sudokuDigits.map((digit, index) => {
        return (
          <DigitCell
            key={index}
            isSelected={digit === focusedCell.value}
            isValid={focusedCell.isValueValid ?? true}
            onClick={() => {
              focusCell(null);
              updateCellValue(digit);
            }}
          >
            {digit}
          </DigitCell>
        );
      })}
    </Selector>
  ) : (
    <div />
  );
};

export default DigitSelector;
