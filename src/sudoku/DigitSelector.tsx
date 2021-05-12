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
    props.isSelected ? (props.isValid ? "#001f3f" : "#FF4136") : "white"};
  justify-content: center;
  font-size: 22px;
  transition: all 0.2s;
  cursor: pointer;
  :hover {
    opacity: (0.8);
    transform: scale(1.2);
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
  height: 100px;
  max-width: 100px;
  align-items: center;
  justify-content: center;
  background-color: #d0d3d4;
  border: 2px solid;
  border-color: white;
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
      top={600 - 66.68 * focusedCell?.coordinates.y + 16.66}
      left={66.68 * focusedCell?.coordinates.x - 16.66}
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
